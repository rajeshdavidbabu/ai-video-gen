import { Webhooks } from "@polar-sh/nextjs";
import { prisma } from "@/db/prisma";
import { CreditTransactionStatus } from "@prisma/client";
import { addCreditsToUser } from "@/db/api/credit";
import { env } from "@/lib/env.server";

// Type definitions to help with Polar webhook payloads
type PolarWebhookPayload = {
  type: string;
  data: {
    id?: string;
    reference_id?: string;
    customer?: {
      id?: string;
      email?: string;
      name?: string;
    };
    product?: {
      id?: string;
      name?: string;
    };
    items?: Array<{
      label?: string;
      productPriceId?: string;
    }>;
    productId?: string;
    amount?: number;
    totalAmount?: number;
    currency?: string;
  };
};

// Get product IDs from environment variables
const PRODUCT_ID_STARTER_PACK = env.PRODUCT_ID_STARTER_PACK;
const PRODUCT_ID_VALUE_PACK = env.PRODUCT_ID_VALUE_PACK;

// Create the Polar webhook handler
export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  
  // Handle order paid event - this is when credits should be added
  onOrderPaid: async (payload) => {
    // Log the full payload in development for debugging
    console.log("Order paid payload:", JSON.stringify(payload));
    
    try {
      // Access the webhook data using the correct structure
      const webhookData = payload as unknown as PolarWebhookPayload;
      
      if (!webhookData.data?.customer?.email) {
        console.error("No customer email found in webhook data");
        return;
      }
      
      const customerEmail = webhookData.data.customer.email;
      console.log("Customer email found:", customerEmail);
      
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: customerEmail }
      });
      
      if (!user) {
        console.error("User not found for email:", customerEmail);
        return;
      }
      
      // Determine credits to add based on the product they purchased
      let creditsToAdd = 0;
      
      // Check the product ID directly
      const productId = webhookData.data.productId;
      console.log("Product ID from webhook:", productId);
      
      if (productId === PRODUCT_ID_STARTER_PACK) {
        creditsToAdd = 2; // Starter Pack: 2 credits
      } else if (productId === PRODUCT_ID_VALUE_PACK) {
        creditsToAdd = 5; // Value Pack: 5 credits
      }
      
      if (creditsToAdd === 0) {
        console.error("Could not determine credits to add for order. Product ID:", productId);
        return;
      }
      
      // Add credits to user
      await addCreditsToUser(user.id, creditsToAdd);
      
      // Get order details for records
      const polarOrderId = webhookData.data.id || `polar-${Date.now()}`;
      const productName = webhookData.data.product?.name || (productId === PRODUCT_ID_STARTER_PACK ? "Starter Pack" : "Value Pack");
      const amount = webhookData.data.totalAmount || 0;
      const currency = webhookData.data.currency || "usd";
      
      // Transaction record with PRISMA TRANSACTION to ensure both records are created
      await prisma.$transaction(async (tx) => {
        // 1. Create credit transaction with purchased status
        await tx.creditTransaction.create({
          data: {
            userId: user.id,
            jobId: `polar-purchase-${polarOrderId}`,
            amount: creditsToAdd,
            status: CreditTransactionStatus.purchased,
            description: `Credits purchased via Polar - ${productName}`
          }
        });
        
        // 2. Create payment record
        await tx.payment.create({
          data: {
            userId: user.id,
            amount: amount / 100, // Convert from cents to dollars/euros
            creditsAdded: creditsToAdd,
            providerTransactionId: polarOrderId,
            metadata: {
              provider: "polar",
              productId: productId,
              productName: productName,
              currency: currency,
              orderId: polarOrderId
            }
          }
        });
      });
      
      console.log(`Added ${creditsToAdd} credits to user ${user.id} (${customerEmail}) and recorded payment details`);
    } catch (error) {
      console.error("Error processing paid order:", error);
    }
  }
});

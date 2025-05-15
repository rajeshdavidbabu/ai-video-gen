import { NextRequest } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Use the latest API version
});

// Define product information
const PRODUCTS = {
  "starter-pack": {
    name: "Starter Pack",
    description: "2 credits to create AI-powered short videos",
    price: 500, // $5.00 in cents
    image: "https://yourdomain.com/images/starter-pack.png", // Replace with your actual image URL
  },
  "value-pack": {
    name: "Value Pack",
    description: "5 credits to create AI-powered short videos",
    price: 1000, // $10.00 in cents
    image: "https://yourdomain.com/images/value-pack.png", // Replace with your actual image URL
  },
};

export async function POST(req: NextRequest) {
  try {
    // Get the current user session
    const session = await auth();
    
    if (!session?.user?.email) {
      return Response.json(
        { error: "You must be logged in to make a purchase" },
        { status: 401 }
      );
    }

    // Get the product ID from the request body
    const { productId } = await req.json();
    
    if (!productId || !PRODUCTS[productId as keyof typeof PRODUCTS]) {
      return Response.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = PRODUCTS[productId as keyof typeof PRODUCTS];

    // Create a Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              images: product.image ? [product.image] : undefined,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        productId: productId,
      },
    });

    // Return the checkout URL
    return Response.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
} 
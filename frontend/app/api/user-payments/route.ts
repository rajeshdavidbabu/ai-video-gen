import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to view payment history",
        },
        { status: 401 }
      );
    }

    // Get user payment history
    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        creditsAdded: true,
        createdAt: true,
        metadata: true,
      },
    });

    // Transform the response to include currency and status from metadata
    const formattedPayments = payments.map(payment => ({
      ...payment,
      currency: payment.metadata?.currency || 'usd',
      status: payment.metadata?.status || 'success',
      provider: payment.metadata?.provider || 'stripe',
    }));

    return Response.json(formattedPayments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return Response.json(
      {
        error: "Failed to fetch payment history",
        message: "An error occurred while fetching your payment history",
      },
      { status: 500 }
    );
  }
} 
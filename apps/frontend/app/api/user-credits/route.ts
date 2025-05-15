import { auth } from "@/auth";
import { getUserCreditBalance } from "@/db/api/credit";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to view credits",
        },
        { status: 401 }
      );
    }

    // Get user credit balance including pending transactions
    const creditBalance = await getUserCreditBalance(session.user.id);

    return Response.json(creditBalance);
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return Response.json(
      {
        error: "Failed to fetch credits",
        message: "An error occurred while fetching your credit balance",
      },
      { status: 500 }
    );
  }
} 
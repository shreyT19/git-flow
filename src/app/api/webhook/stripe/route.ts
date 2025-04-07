import {
  createCreditTransaction,
  updateUserCredits,
} from "@/actions/user/repository";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error(
      "Webhook signature verification failed:",
      (err as Error).message,
    );
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const credits = Number(session.metadata?.credits);

        if (!userId || !credits) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
          );
        }

        await Promise.all([
          createCreditTransaction(userId, credits, session.id),
          updateUserCredits(userId, credits),
        ]);

        return NextResponse.json(
          { message: "Credit transaction created successfully" },
          { status: 200 },
        );

      default:
        // Return 200 for unhandled events to prevent retries
        return NextResponse.json(
          { message: `Unhandled event type: ${event.type}` },
          { status: 200 },
        );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

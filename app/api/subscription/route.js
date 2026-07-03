import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        plan: "free",
        status: "inactive",
      });
    }

    const subscription = await Subscription.findOne({
      userEmail: session.user.email,
    });

    if (!subscription) {
      return NextResponse.json({
        plan: "free",
        status: "inactive",
      });
    }

    if (
      subscription.expiresAt &&
      new Date(subscription.expiresAt) < new Date()
    ) {
      subscription.plan = "free";
      subscription.status = "inactive";
      await subscription.save();
    }

    return NextResponse.json(subscription);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        plan: "free",
        status: "inactive",
      },
      {
        status: 500,
      }
    );
  }
}
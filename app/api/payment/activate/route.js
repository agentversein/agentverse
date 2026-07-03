import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import Payment from "@/models/Payment";
export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    const expiresAt = new Date();

    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await Subscription.findOneAndUpdate(
      {
        userEmail: session.user.email,
      },
      {
        userEmail: session.user.email,
        plan,
        status: "active",
        expiresAt,
      },
      {
        upsert: true,
      }
    );
await Payment.findOneAndUpdate(
  {
    userEmail: session.user.email,
    status: "Pending",
  },
  {
    plan: "PRO",
    status: "Paid",
  },
  {
    sort: { createdAt: -1 },
  }
);
    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
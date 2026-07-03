import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Chat from "@/models/Chat";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    await connectDB();

    const chats = await Chat.countDocuments();

    const payments = await Payment.countDocuments({
      status: "Paid",
    });

    const paidPayments = await Payment.find({
      status: "Paid",
    });

    const revenue = paidPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const proUsers = await Subscription.countDocuments({
      plan: "pro",
      status: "active",
    });

    const users = await Subscription.distinct("userEmail");

    return NextResponse.json({
      users: users.length,
      payments,
      revenue,
      proUsers,
      chats,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        users: 0,
        payments: 0,
        revenue: 0,
        proUsers: 0,
        chats: 0,
      },
      {
        status: 500,
      }
    );
  }
}
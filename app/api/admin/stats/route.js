import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import Chat from "@/models/Chat";
import Subscription from "@/models/Subscription";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connectDB();

    const users = await User.countDocuments();

    const chats = await Chat.countDocuments();

    const proUsers = await Subscription.countDocuments({
      plan: "pro",
      status: "active",
    });

    const paidPayments = await Payment.find({
      status: "Paid",
    });

    const revenue = paidPayments.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return NextResponse.json({
      users,
      chats,
      proUsers,
      revenue,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        users: 0,
        chats: 0,
        proUsers: 0,
        revenue: 0,
      },
      {
        status: 500,
      }
    );
  }
}
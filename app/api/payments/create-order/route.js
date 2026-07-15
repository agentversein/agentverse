import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("PUBLIC:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    console.log("SECRET EXISTS:", !!process.env.RAZORPAY_KEY_SECRET);

    const { plan } = await req.json();

    console.log("PLAN:", plan);

    await connectDB();

    const prices = {
      pro: 9900,      // ₹99.00
      business: 9900, // ₹99.00
    };

    console.log("PRICE:", prices[plan]);

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!prices[plan]) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: prices[plan],
      currency: "INR",
      receipt: `agentverse_${Date.now()}`,
    });

    console.log("ORDER AMOUNT:", order.amount);

    await Payment.create({
      userEmail: session.user.email,
      orderId: order.id,
      paymentId: "",
      plan: plan.toUpperCase(),
      amount: prices[plan] / 100,
      currency: "INR",
      status: "Pending",
    });

    return NextResponse.json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}
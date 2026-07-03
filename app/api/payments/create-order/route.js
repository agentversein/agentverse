import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);
    const { plan } = await req.json();
await connectDB();

const session = await getServerSession(authOptions);

if (!session) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
    const prices = {
      pro: 49900,       // ₹499.00
      business: 99900,  // ₹999.00
    };

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
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}
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
console.log("STEP 1");

await connectDB();

console.log("STEP 2");

const prices = {
  pro: 9900,
};

const session = await getServerSession(authOptions);

console.log("STEP 3", session?.user?.email);

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

console.log("STEP 4", order);

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
  console.error("CREATE ORDER ERROR:");
  console.dir(error, { depth: null });

  return NextResponse.json(
    {
      success: false,
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      error,
    },
    { status: 500 }
  );
}
}
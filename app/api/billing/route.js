import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connectDB();

    const payments = await Payment.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(payments);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load billing history" },
      { status: 500 }
    );
  }
}
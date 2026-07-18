import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    await connectDB();

    const invoices = await Invoice.find()
      .populate("customer")
      .sort({ createdAt: -1 });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
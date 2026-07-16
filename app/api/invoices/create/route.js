import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Auto Invoice Number
    const totalInvoices = await Invoice.countDocuments();

    const invoiceNumber =
      `INV-${new Date().getFullYear()}-${String(totalInvoices + 1).padStart(6, "0")}`;

    const invoice = await Invoice.create({
      ...body,
      invoiceNumber,
    });

    return NextResponse.json({
      success: true,
      invoice,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
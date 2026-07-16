import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const customer = await Customer.create({
      name: body.name,
      phone: body.phone,
      email: body.email,
      gst: body.gst,
      address: body.address,
    });

    return NextResponse.json({
      success: true,
      customer,
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
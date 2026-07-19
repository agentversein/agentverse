import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export async function GET() {
  try {
    await connectDB();

    const company = await Company.findOne();

    return NextResponse.json(company || {});
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    let company = await Company.findOne();

    if (company) {
      company = await Company.findByIdAndUpdate(
        company._id,
        body,
        { new: true }
      );
    } else {
      company = await Company.create(body);
    }

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
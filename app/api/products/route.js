import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  const products = await Product.find().sort({
    createdAt: -1,
  });

  return NextResponse.json(products);
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
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

export async function DELETE(req) {
  await connectDB();

  const { id } = await req.json();

  await Product.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
  });
}
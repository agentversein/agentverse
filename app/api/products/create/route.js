import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      sku: body.sku,
      hsnCode: body.hsnCode,
      gst: Number(body.gst),
      purchasePrice: Number(body.purchasePrice),
      sellingPrice: Number(body.sellingPrice),
      stock: Number(body.stock),
    });

    return NextResponse.json({
      success: true,
      product,
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
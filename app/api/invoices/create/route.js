import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
if (!body.customer) {
  return NextResponse.json(
    {
      success: false,
      message: "Customer is required",
    },
    { status: 400 }
  );
}

if (!body.items || body.items.length === 0) {
  return NextResponse.json(
    {
      success: false,
      message: "No products selected",
    },
    { status: 400 }
  );
}
    // Auto Invoice Number
    const totalInvoices = await Invoice.countDocuments();

    const invoiceNumber =
      `INV-${new Date().getFullYear()}-${String(totalInvoices + 1).padStart(6, "0")}`;

    const invoice = await Invoice.create({
  ...body,
  invoiceNumber,
});

// Reduce Stock
for (const item of body.items) {
  if (!item.product) continue;

  await Product.findByIdAndUpdate(
    item.product,
    {
      $inc: {
        stock: -Number(item.qty),
      },
    }
  );
}
for (const item of body.items) {
  if (!item.productId) continue;

  const product = await Product.findById(item.productId);

  if (!product) continue;

  if (product.stock < item.qty) {
    return NextResponse.json(
      {
        success: false,
        message: `${product.name} stock is not enough`,
      },
      { status: 400 }
    );
  }

  product.stock -= Number(item.qty);

  await product.save();
}
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
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connectDB();

    const payments = await Payment.find({
      status: "Paid",
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const values = new Array(12).fill(0);

    payments.forEach((payment) => {
      const month = new Date(payment.createdAt).getMonth();
      values[month] += payment.amount;
    });

    return NextResponse.json({
      labels: months,
      values,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json({
      labels: [],
      values: [],
    });
  }
}
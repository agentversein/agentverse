import { NextResponse } from "next/server";

export async function POST(req) {
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Password change endpoint is ready.",
  });
}
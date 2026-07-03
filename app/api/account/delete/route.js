import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Chat from "@/models/Chat";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Delete user's chats
    await Chat.deleteMany({
      userEmail: session.user.email,
    });

    // Delete user
    await User.deleteOne({
      email: session.user.email,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete account",
      },
      { status: 500 }
    );
  }
}
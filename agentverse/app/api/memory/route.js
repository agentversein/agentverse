import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Memory from "@/models/Memory";

// GET all memories
export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const memories = await Memory.find({
    userEmail: session.user.email,
  });

  return NextResponse.json(memories);
}

// Save memory
export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { key, value } = await req.json();

  const memory = await Memory.findOneAndUpdate(
    {
      userEmail: session.user.email,
      key,
    },
    {
      value,
    },
    {
      new: true,
      upsert: true,
    }
  );

  return NextResponse.json(memory);
}
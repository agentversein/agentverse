import { prisma } from "@/lib/prisma";

// ✅ SAVE / UPDATE CHAT
export async function POST(req) {
  try {
    const body = await req.json();
    const { id, messages, title } = body;

    let chat;

    if (id) {
      // UPDATE
      chat = await prisma.chat.update({
        where: { id },
        data: { messages },
      });
    } else {
      // CREATE
      chat = await prisma.chat.create({
        data: {
          title: title || "New Chat",
          messages,
        },
      });
    }

    return Response.json(chat);

  } catch (error) {
    console.error("POST Error:", error);

    return Response.json(
      { error: "Failed to save chat" },
      { status: 500 }
    );
  }
}

// ✅ GET ALL CHATS
export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(chats);

  } catch (error) {
    console.error("GET Error:", error);

    return Response.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
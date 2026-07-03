import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectDB();

    const chats = await Chat.find().sort({
      updatedAt: -1,
    });

    return Response.json(chats);
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Failed to fetch chats",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH() {
  try {
    await connectDB();

    const chats = await Chat.find().sort({ createdAt: 1 });

    for (let i = 0; i < chats.length; i++) {
      chats[i].title = `Chat ${i + 1}`;
      await chats[i].save();
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: "Rename failed" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const chat = await Chat.create({
      title: body.title || "New Chat",
      messages: [],
    });

    return Response.json(chat);
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Failed to create chat",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { id } = await req.json();

    await Chat.findByIdAndDelete(id);

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}
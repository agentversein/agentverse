import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: String, // "user" or "assistant"
  content: String,
});

const ChatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },

    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Chat ||
  mongoose.model("Chat", ChatSchema);
import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    key: {
      type: String,
      default: null,
    },

    value: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      default: null,
    },

    content: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: "conversation",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Memory ||
  mongoose.model("Memory", MemorySchema);
  
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      default: "google",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isPro: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
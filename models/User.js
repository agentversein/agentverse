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
    chatCount: {
  type: Number,
  default: 0,
},

imageCount: {
  type: Number,
  default: 0,
},

codeCount: {
  type: Number,
  default: 0,
},

seoCount: {
  type: Number,
  default: 0,
},

resumeCount: {
  type: Number,
  default: 0,
},

emailCount: {
  type: Number,
  default: 0,
},

researchCount: {
  type: Number,
  default: 0,
},

dataCount: {
  type: Number,
  default: 0,
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
import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    plan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "inactive",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    amount: Number,
    currency: {
      type: String,
      default: "INR",
    },

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
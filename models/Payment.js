import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },

    orderId: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      default: "FREE",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
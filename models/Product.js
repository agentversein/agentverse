import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    barcode: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    hsnCode: {
      type: String,
      default: "",
    },

    gst: {
      type: Number,
      default: 18,
    },

    purchasePrice: {
      type: Number,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    lowStockAlert: {
      type: Number,
      default: 10,
    },

    brand: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
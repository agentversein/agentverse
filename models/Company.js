import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifsc: {
      type: String,
      default: "",
    },

    upiId: {
      type: String,
      default: "",
    },

    signature: {
      type: String,
      default: "",
    },

    primaryColor: {
      type: String,
      default: "#1E40AF",
    },

    secondaryColor: {
      type: String,
      default: "#F59E0B",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Company ||
  mongoose.model("Company", CompanySchema)
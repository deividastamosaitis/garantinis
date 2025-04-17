import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  accessories: { type: String },
  status: {
    type: String,
    enum: ["registered", "sent", "returned", "credit"],
    default: "registered",
  },
  notified: {
    type: String,
    enum: ["notified", "not_notified"],
    default: "not_notified",
  },
  epromaStatus: { type: String, default: "Nepatikrinta" },
  epromaRMA: { type: String },
  additionalInfo: { type: String },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", ProductSchema);

import mongoose from "mongoose";

const PrekeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    barkodas: {
      type: String,
      required: true,
    },
    pavadinimas: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Preke = mongoose.model("Preke", PrekeSchema);

export default Preke;

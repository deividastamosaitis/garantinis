import mongoose from "mongoose";

const KlientasSchema = new mongoose.Schema(
  {
    vardas: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    miestas: {
      type: String,
      default: "Kaunas",
    },
  },
  { timestamps: true }
);

const Klientas = mongoose.model("Klientas", KlientasSchema);

export default Klientas;

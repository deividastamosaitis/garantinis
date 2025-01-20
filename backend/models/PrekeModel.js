import mongoose from "mongoose";
import { PREKE_KATEGORIJA } from "../utils/constants.js";

const PrekeSchema = new mongoose.Schema(
  {
    barkodas: {
      type: String,
      required: true,
    },
    pavadinimas: {
      type: String,
      required: true,
    },
    kategorija: {
      type: String,
      enum: Object.values(PREKE_KATEGORIJA),
      default: PREKE_KATEGORIJA.DEFAULT,
    },
  },
  { timestamps: true }
);

const Preke = mongoose.model("Preke", PrekeSchema);

export default Preke;

import mongoose from "mongoose";

const PardavimasSchema = new mongoose.Schema(
  {
    preke: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Preke",
    },
    barkodas: {
      type: String,
      required: true,
    },
    serial: {
      type: String,
      required: true,
      default: "1",
    },
    tipas: {
      type: String,
      required: true,
    },
    kaina: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pardavimas = mongoose.model("Pardavimas", PardavimasSchema);

export default Pardavimas;

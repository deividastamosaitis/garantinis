import mongoose from "mongoose";

const KrepselisSchema = new mongoose.Schema(
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

const Krepselis = mongoose.model("Krepselis", KrepselisSchema);

export default Krepselis;

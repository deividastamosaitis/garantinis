import mongoose from "mongoose";

const GarantinisPrekeSchema = new mongoose.Schema({
  barkodas: {
    type: String,
  },
  pavadinimas: {
    type: String,
    required: true,
  },
  serial: {
    type: String,
  },
  kaina: {
    type: Number,
    required: true,
  },
});

const GarantinisSchema = new mongoose.Schema(
  {
    klientas: {
      vardas: {
        type: String,
        required: true,
      },
      telefonas: {
        type: String,
        required: true,
      },
      miestas: {
        type: String,
        default: "Kaunas",
      },
    },
    prekes: [GarantinisPrekeSchema],
    kvitas: {
      type: String,
      required: false,
    },
    atsiskaitymas: {
      type: String,
      required: true,
    },
    saskaita: {
      type: String,
    },
    totalKaina: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Nuoroda į User modelį
      required: true,
    },
  },
  { timestamps: true }
);

const Garantinis = mongoose.model("Garantinis", GarantinisSchema);

export default Garantinis;

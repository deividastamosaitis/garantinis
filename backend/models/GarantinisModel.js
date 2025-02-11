import mongoose from "mongoose";

const GarantinisPrekeSchema = new mongoose.Schema({
  barkodas: {
    type: String,
    required: true,
  },
  pavadinimas: {
    type: String,
    required: true,
  },
  serial: {
    type: String,
    required: true,
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
  },
  { timestamps: true }
);

const Garantinis = mongoose.model("Garantinis", GarantinisSchema);

export default Garantinis;

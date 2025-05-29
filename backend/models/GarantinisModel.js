// Atnaujinta garantinio schema su daugybine atsiskaitymo galimybe
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

const AtsiskaitymasSchema = new mongoose.Schema(
  {
    tipas: {
      type: String,
      enum: ["grynais", "kortele", "pavedimas", "COD", "lizingas"],
      required: true,
    },
    suma: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const GarantinisSchema = new mongoose.Schema({
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
  },
  atsiskaitymas: {
    type: [AtsiskaitymasSchema],
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
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Garantinis = mongoose.model("Garantinis", GarantinisSchema);

export default Garantinis;

import mongoose from "mongoose";

export const MANUFACTURERS = {
  DAHUA: ["IP kameros", "HDD", "IP kameros priedai"],
  IMOU: ["WiFi kameros", "WiFi baterinės", "SIM baterinės", "IMOU aksesuarai"],
  Reolink: [
    "WiFi kameros",
    "WiFi baterinės",
    "SIM baterinės",
    "Reolink aksesuarai",
  ],
  Segway: ["vejos robotai", "vejos robotu priedai"],
  DCK: [
    "vejos robotai",
    "vejos robotu priedai",
    "remontas",
    "el. irankiai",
    "sodo reikmenys",
    "irankiu priedai",
  ],
  "70Mai": ["vaizdo registratoriai", "vaizdo registratorių priedai"],
  AIRSEEKERS: ["vejos robotai", "vejos robotu priedai"],
  "AL priority": ["radaru detektoriai", "radaru detektoriu priedai"],
  AlcoDetector: ["alkotesteriai", "alkotesteriu priedai"],
  Alcoscan: ["alkotesteriai", "alkotesteriu priedai"],
  Anker: [
    "atsarginiai maitinimo saltiniai",
    "atsarginiu maitinimo saltiniu priedai",
  ],
  AYI: ["vejos robotai", "vejos robotu priedai"],
  Blackvue: ["vaizdo registratoriai", "vaizdo registratoriu priedai"],
  Bluetti: [
    "atsarginiai maitinimo saltiniai",
    "atsarginiu maitinimo saltiniu priedai",
  ],
  "Cardo Scala": ["motociklų įranga", "motociklų įrangos priedai"],
  Cellink: ["vaizdo registratoriu priedai"],
  CFMoto: ["generatoriai"],
  CyberPower: ["atsarginiai maitinimo saltiniai"],
  Digitus: ["atsarginiai maitinimo saltiniai"],
  Drager: ["alkotesteriai", "alkotesteriu priedai"],
  "Dreame MOVA": ["vejos robotai", "vejos robotu priedai"],
  EAST: ["atsarginiai maitinimo saltiniai"],
  EATON: ["atsarginiai maitinimo saltiniai"],
  Ecoflow: [
    "atsarginiai maitinimo saltiniai",
    "atsarginiu maitinimo saltiniu priedai",
  ],
  Ecovacs: ["vejos robotai", "vejos robotu priedai"],
  Garmin: [
    "vaizdo registratoriai",
    "vaizdo registratorių priedai",
    "laikrodžiai",
    "navigacijos",
    "navigaciju priedai",
    "laikrodziu priedai",
    "maitinimo laidai",
  ],
  Genevo: ["radaru detektoriai", "radaru detektoriu priedai"],
  Hookii: ["vejos robotai", "vejos robotu priedai"],
  Insta360: ["action kameros", "priedai"],
  MIO: ["vaizdo registratoriai", "vaizdo registratoriu priedai"],
  Motorola: ["PMR racijos", "PMR racijos priedai"],
  Neoline: ["radarų detektoriai", "vaizdo registratoriai", "priedai"],
  PELCO: ["IP kameros", "IP kameru priedai"],
  President: [
    "CB racijos",
    "CB raciju priedai",
    "CB Antenos",
    "CB Antenos priedai",
  ],
  Sunseeker: ["vejos robotai", "vejos robotu priedai"],
  "Target Blue EYE": ["radaru detektoriai", "radaru detektoriu priedai"],
  Teltonika: ["maršrutizatoriai", "maršrutizatorių priedai"],
  TerraMow: ["vejos robotai", "vejos robotu priedai"],
  Tuya: ["išmani namų sistema"],
  Wile: ["drėgnomačiai", "priedai"],
  MAGVEDA: ["SIM kortele", "Seklys"],
  KABELIS: ["FTP kabelis"],
  TPLINK: ["WiFi antenos"],
  LEXAR: ["SD kortelė"],
};

const PrekeSchema = new mongoose.Schema(
  {
    barkodas: { type: String, required: true, unique: true, trim: true },
    pavadinimas: { type: String, required: true, trim: true },
    gamintojas: {
      type: String,
      required: true,
      enum: Object.keys(MANUFACTURERS),
    },
    grupe: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

PrekeSchema.pre("validate", function (next) {
  if (this.gamintojas) {
    const allowed = MANUFACTURERS[this.gamintojas] || [];
    if (!allowed.includes(this.grupe)) {
      return next(
        new Error(
          `Grupė "${this.grupe}" negalima gamintojui "${
            this.gamintojas
          }". Leidžiamos: ${allowed.join(", ")}`
        )
      );
    }
  }
  next();
});

PrekeSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Barkodas jau egzistuoja"));
  } else {
    next(error);
  }
});

const Preke = mongoose.model("Preke", PrekeSchema);

export default Preke;

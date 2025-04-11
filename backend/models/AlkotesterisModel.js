import mongoose from "mongoose";

const AlkotesterisSchema = new mongoose.Schema({
  registrationDate: { type: Date, default: Date.now },
  deviceName: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  clientPhone: { type: String, required: true },
  clientName: { type: String, required: true },
  status: {
    type: String,
    enum: ["registruota", "kalibruojama", "grįžęs", "atiduota"],
    default: "registruota",
  },
  lastUpdated: { type: Date, default: Date.now },
});

const Alkotesteris = mongoose.model("Alkotesteris", AlkotesterisSchema);

export default Alkotesteris;

import mongoose from "mongoose";

const ExternalServiceSchema = new mongoose.Schema(
  {
    sentTo: String, // Pvz. "eproma.lt"
    sentDate: Date, // Kada išsiųsta
    rmaCode: String, // Pvz. "RMA123456"
    status: {
      type: String,
      enum: ["Išsiųsta", "Grąžinta", "Atsisakyta", "Nežinoma"],
      default: "Išsiųsta",
    },
    returnDate: Date, // Kada grąžinta (nebūtina)
  },
  { _id: false }
);

const ServiceTicketSchema = new mongoose.Schema({
  client: {
    name: String,
    phone: String,
    email: String,
  },
  product: {
    category: {
      type: String,
      enum: ["Robotas", "Kamera", "Registratorius", "Radaras"],
    },
    brand: String,
    model: String,
    serialNumber: String,
    externalService: ExternalServiceSchema, // ← čia nauja dalis
  },
  problemDescription: String,
  receivedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      "Naujas",
      "Diagnostika",
      "Dalių užsakymas",
      "Remontuojama",
      "Paruošta atsiėmimui",
      "Uždaryta",
    ],
    default: "Naujas",
  },
  history: [
    {
      status: String,
      date: { type: Date, default: Date.now },
      note: String,
    },
  ],
  assignedTo: String,
  notes: String,
});

export default mongoose.model("ServiceTicket", ServiceTicketSchema);

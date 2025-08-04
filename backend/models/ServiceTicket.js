import mongoose from "mongoose";

const ExternalServiceSchema = new mongoose.Schema(
  {
    sentTo: String, // Pvz. "eproma.lt"
    sentDate: Date, // Kada išsiųsta
    rmaCode: String, // Pvz. "RMA123456"
    supplierRmaCode: String,
    status: {
      type: String,
      enum: ["Išsiųsta", "Laukiama", "Kreditas", "Grąžinta", "Registruota"],
      default: "Registruota",
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
      enum: ["Robotas", "Kamera", "Registratorius", "Radaras", "Kita"],
    },
    brand: String,
    model: String,
    serialNumber: String,
    externalService: ExternalServiceSchema, // ← čia nauja dalis
  },
  keyword: { type: String },
  problemDescription: String,
  receivedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      "Užregistruota",
      "Laukiama prekė iš kliento",
      "Prekė gauta į servisą",
      "Laukiama papildoma informacija iš kliento",
      "Diagnostika",
      "Išsiųsta į autorizuotą servisą",
      "Dalių užsakymas",
      "Remontuojama",
      "Paruošta atsiėmimui",
      "Prekė išsiųsta klientui",
      "Uždaryta",
    ],
    default: "Naujas",
  },
  attachments: {
    type: [String],
    default: [],
  },
  history: [
    {
      status: String,
      date: { type: Date, default: Date.now },
      note: String,
      from: String,
    },
  ],
  assignedTo: String,
  notes: String,
});

export default mongoose.model("ServiceTicket", ServiceTicketSchema);

import mongoose from "mongoose";

const PrekeSchema = new mongoose.Schema(
  {
    barkodas: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    pavadinimas: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

PrekeSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Barkodas jau egzistuoja"));
  } else {
    next(error);
  }
});

const Preke = mongoose.model("Preke", PrekeSchema);

export default Preke;

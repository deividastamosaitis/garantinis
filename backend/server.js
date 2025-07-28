import * as dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";
//routers
import PrekeRouter from "./routes/prekeRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import KlientasRouter from "./routes/klientasRouter.js";
import GarantinisRouter from "./routes/garantinisRouter.js";
import AlkotesterisRouter from "./routes/alkotesteriaiRouter.js";
import RMARouter from "./routes/rmaRouter.js";
import serviceTicketRoutes from "./routes/serviceTicketRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

//middleware
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";

//public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
app.use(
  cors({
    origin: "*", // arba konkretus domenas jei hostinsi išorėje
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./public")));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/prekes", authenticateUser, PrekeRouter);
app.use("/api/users", authenticateUser, userRouter);
app.use("/api/klientai", authenticateUser, KlientasRouter);
app.use("/api/garantinis", GarantinisRouter);
app.use("/api/alkotesteriai", authenticateUser, AlkotesterisRouter);
app.use("/api/rma", authenticateUser, RMARouter);
app.use("/api/auth", authRouter);
app.use("/api/uploads", uploadRoutes);
app.use("/api/tickets", serviceTicketRoutes);

app.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "tavopastas@example.com",
      subject: "Testas iš GPSmeistras",
      text: "Sveiki! Laiško siuntimas veikia.",
    });
    res.send("✅ Laiškas išsiųstas!");
  } catch (err) {
    console.error("❌ SMTP klaida:", err.message);
    res.status(500).send("SMTP klaida: " + err.message);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "Nėra tokio puslapio" });
});

app.use(errorHandlerMiddleware);

mongoose
  .connect(process.env.DATABASE_URL, { dbName: process.env.DATABASE_NAME })
  .then(() => {
    console.log("Prisijungta prie mongodb sekmingai");
    app.listen(4000, () => console.log("listening to port 4000"));
  })
  .catch((err) => console.log(err));

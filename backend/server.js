import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { garantinisRoutes } from "./routes/garantinisRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";
import { klientasRoutes } from "./routes/klientasRoutes.js";
import { krepselisRoutes } from "./routes/krepselisRoutes.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

app.use("/api/garantinis", garantinisRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/klientas", klientasRoutes);
app.use("/api/krepselis", krepselisRoutes);

mongoose
  .connect(process.env.DATABASE_URL, { dbName: process.env.DATABASE_NAME })
  .then(() => {
    console.log("Prisijungta prie mongodb sekmingai");
    app.listen(5100, () => console.log("listening to port 5100"));
  })
  .catch((err) => console.log(err));

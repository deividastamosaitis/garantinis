import express from "express";
import mongoose from "mongoose";
import { garantinisRoutes } from "./routes/garantinisRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/garantinis", garantinisRoutes);
app.use("/api/users", usersRoutes);

mongoose
  .connect(
    "mongodb+srv://deividas:av4Qy5clUXqKmL38@gpsmeistras.cxdop.mongodb.net",
    { dbName: "garantiniai" }
  )
  .then(() => {
    console.log("Prisijungta prie mongodb sekmingai");
    app.listen(4000, "localhost", () => console.log("listening to port 4000"));
  })
  .catch((err) => console.log(err));

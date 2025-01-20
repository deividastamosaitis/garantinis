import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//routers
import PrekeRouter from "./routes/prekeRouter.js";
import { usersRoutes } from "./routes/usersRoutes.js";

//middleware
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/prekes", PrekeRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "Nėra tokio puslapio" });
});

app.use(errorHandlerMiddleware);

mongoose
  .connect(process.env.DATABASE_URL, { dbName: process.env.DATABASE_NAME })
  .then(() => {
    console.log("Prisijungta prie mongodb sekmingai");
    app.listen(5100, () => console.log("listening to port 5100"));
  })
  .catch((err) => console.log(err));

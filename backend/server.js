import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//routers
import PrekeRouter from "./routes/prekeRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";

//middleware
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

app.use("/api/prekes", authenticateUser, PrekeRouter);
app.use("/api/users", authenticateUser, userRouter);
app.use("/api/auth", authRouter);

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

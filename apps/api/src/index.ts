import "dotenv/config";
import express from "express";
import prisma from "@garantinis/db";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.get("/health", async (_req, res) => {
  const dbStatus = await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok", db: dbStatus ? "up" : "down" });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

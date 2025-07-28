import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/", authenticateUser, upload.array("files"), (req, res) => {
  const filenames = req.files.map((file) => file.filename);
  res.json({ uploaded: filenames });
});

router.delete("/:filename", authenticateUser, (req, res) => {
  const filename = req.params.filename;
  const safeName = filename.replace(/[^a-zA-Z0-9_\-\.]/g, ""); // apsauga
  const filePath = path.join("public/uploads", safeName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("❌ Nepavyko ištrinti:", err.message);
      return res
        .status(404)
        .json({ error: "Failas nerastas arba nepavyko ištrinti" });
    }

    res.json({ msg: "✅ Failas ištrintas sėkmingai" });
  });
});

export default router;

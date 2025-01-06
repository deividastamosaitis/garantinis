import mongoose from "mongoose";
import Preke from "../models/PrekeModel.js";
import User from "../models/UserModel.js";

/*************** Visos prekes */
const getPrekes = async (req, res) => {
  try {
    const prekes = await Preke.find();
    res.status(200).json({ prekes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*******************Prekes sukurimas */
const addPreke = async (req, res) => {
  //pasiimam data is body
  const { pavadinimas, kaina } = req.body;

  //tikrinam ar nera neuzpildytu vietu
  if (!pavadinimas || !kaina) {
    return res.status(400).json({ error: "Neuzpildyta pilnai forma" });
  }

  //imam autorizuota useri
  const user = await User.findById(req.user._id);

  try {
    const preke = await Preke.create({ user: user._id, pavadinimas, kaina });
    res.status(200).json({ msg: "Prekė pridėta", preke });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*******************Prekes istrinimas */
const deletePreke = async (req, res) => {
  //tikrinam ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Nera tokios prekes su tokiu ID" });
  }

  //Tikrinam ar yra tokia preke
  const preke = await Preke.findById(req.params.id);
  if (!preke) {
    return res.status(400).json({ error: "Nera tokios prekes" });
  }

  //ziurim ar useris idejo preke
  const user = await User.findById(req.user._id);
  if (!preke.user.equals(user._id)) {
    return res.status(401).json({ error: "Neturi galimybes tai padaryti" });
  }

  try {
    await preke.deleteOne();
    res.status(200).json({ msg: "Prekė istrinta" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*******************Prekes update */
const updatePreke = async (req, res) => {
  //pasiimam data is body
  const { pavadinimas, kaina } = req.body;

  //tikrinam ar nera neuzpildytu vietu
  if (!pavadinimas || !kaina) {
    return res.status(400).json({ error: "Neuzpildyta pilnai forma" });
  }

  //tikrinam ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Nera tokios prekes su tokiu ID" });
  }

  //Tikrinam ar yra tokia preke
  const preke = await Preke.findById(req.params.id);
  if (!preke) {
    return res.status(400).json({ error: "Nera tokios prekes" });
  }

  //ziurim ar useris idejo preke
  const user = await User.findById(req.user._id);
  if (!preke.user.equals(user._id)) {
    return res.status(401).json({ error: "Neturi galimybes tai padaryti" });
  }

  try {
    await preke.updateOne({ pavadinimas, kaina });
    res.status(200).json({ msg: "Prekė atnaujinta" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getPrekes, addPreke, deletePreke, updatePreke };

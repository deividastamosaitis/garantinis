import mongoose from "mongoose";
import Pardavimas from "../models/PardavimasModel.js";
import Preke from "../models/PrekeModel.js";

/***************** VISI PARDAVIMAI */
const getAllPardavimai = async (req, res) => {
  try {
    const pardavimai = await Pardavimas.find();
    res.status(200).json({ pardavimai });
  } catch (error) {
    res.status(500).json({ error: error.mesage });
  }
};

/********** Gauti viena pardavima */
const getPardavimas = async (req, res) => {
  //tikrinam ar yra pardavimas su tokiu ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Nera tokio pardavimo su tokiu ID" });
  }

  //tikrinam ar yra tokia preke
  const pardavimas = await Pardavimas.findById(req.params.id);
  if (!pardavimas) {
    return res.status(400).json({ error: "Nera tokio pardavimo" });
  }

  //ieskom prekes
  try {
    const preke = await Pardavimas.findById(req.params.id);
    res.status(200).json({ preke });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*************** Sukurti pardavima */
const addPardavimas = async (req, res) => {
  //pasiimam data is body
  const { serial, tipas, kaina, barkodas } = req.body;

  //tikrinam ar nera uzpildytu vietu
  if (!serial || !tipas || !kaina || !barkodas) {
    return res.status(400).json({ error: "Neuzpildyta pilnai forma" });
  }

  //imam preke pagal barkoda
  const preke = await Preke.findOne({ barkodas: barkodas });

  //tikrinam ar barkodai pardavimas prekes su preke egzistuoja
  if (!preke) {
    return res.status(400).json({ error: "Tokios prekes su barkodu nera" });
  }

  try {
    const pardavimas = await Pardavimas.create({
      preke: preke._id,
      serial,
      tipas,
      kaina,
      barkodas,
    });
    res.status(200).json({ msg: "Pardavimas pridėta", pardavimas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllPardavimai, getPardavimas, addPardavimas };

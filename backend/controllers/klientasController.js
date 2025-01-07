import mongoose from "mongoose";
import Klientas from "../models/KlientasModel.js";
import User from "../models/UserModel.js";

/************* Visi klientai */

const getKlientas = async (req, res) => {
  try {
    const klientai = await Klientas.find();
    res.status(200).json({ klientai });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/********* Kliento sukurimas */

const addKlientas = async (req, res) => {
  //pasiimam data is body
  const { vardas, tel, miestas } = req.body;
  //tikrinam ar viskas uzpildyta
  if (!vardas || !tel || !miestas) {
    return res.status(400).json({ error: "Baikite pildyti forma" });
  }

  //ziurim ar authorizuotas
  const user = await User.findById(req.user._id);

  try {
    const klientas = await Klientas.create({ vardas, tel, miestas });
    res.status(200).json({ msg: "Klientas sukūrtas", klientas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************** UPDATE KLIENTAS */

const updateKlientas = async (req, res) => {
  //pasiimam data is body
  const { vardas, tel, miestas } = req.body;
  //tikrinam ar viskas uzpildyta
  if (!vardas || !tel || !miestas) {
    return res.status(400).json({ error: "Baikite pildyti forma" });
  }
  //tikrinam ar yra ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ error: "Pagal ID toks klientas neegzistuoja" });
  }
  //tikrinam ar yra toks klientas
  const klientas = await Klientas.findById(req.params.id);
  if (!klientas) {
    return res.status(400).json({ error: "Nera tokio kliento" });
  }

  try {
    await klientas.updateOne({ vardas, tel, miestas });
    res.status(200).json({ msg: "Kliento informacija atnaujinta" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export { addKlientas, updateKlientas, getKlientas };

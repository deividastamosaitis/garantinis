import Garantinis from "../models/GarantinisModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllGarantinis = async (req, res) => {
  const garantinis = await Garantinis.find({})
    .populate("createdBy", "vardas email") // Pridėkite vartotojo informaciją
    .sort({ createdAt: -1 }); // Rūšiuoti pagal datą (naujausi viršuje)

  res.status(StatusCodes.OK).json({ garantinis });
  // const garantinis = await Garantinis.find({});
  // res.status(StatusCodes.OK).json({ garantinis });
};

export const getTodayGarantinis = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  try {
    const garantinis = await Garantinis.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("createdBy", "vardas email")
      .sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ garantinis });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Klaida gaunant duomenis" });
  }
};

export const createGarantinis = async (req, res) => {
  const { klientas, prekes, atsiskaitymas, saskaita, totalKaina } = req.body;

  // Pridėkite prisijungusio vartotojo ID
  const garantinis = await Garantinis.create({
    klientas,
    prekes,
    atsiskaitymas,
    saskaita,
    totalKaina,
    createdBy: req.user.userId, // Čia pridedame vartotojo ID
  });

  res.status(StatusCodes.CREATED).json({ garantinis });
  // const garantinis = await Garantinis.create(req.body);
  // res.status(StatusCodes.CREATED).json({ garantinis });
};

export const getGarantinis = async (req, res) => {
  const { id } = req.params;
  const garantinis = await Garantinis.findById(id);
  res.status(StatusCodes.OK).json({ garantinis });
};

export const updateGarantinis = async (req, res) => {
  const { id } = req.params;
  const updatedGarantinis = await Garantinis.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Atnaujintas garantinis", garantinis: updatedGarantinis });
};

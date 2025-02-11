import Garantinis from "../models/GarantinisModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllGarantinis = async (req, res) => {
  const garantinis = await Garantinis.find({});
  res.status(StatusCodes.OK).json({ garantinis });
};

export const createGarantinis = async (req, res) => {
  const garantinis = await Garantinis.create(req.body);
  res.status(StatusCodes.CREATED).json({ garantinis });
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

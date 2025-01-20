import Prekes from "../models/PrekeModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

export const getAllPrekes = async (req, res) => {
  const prekes = await Prekes.find({});
  res.status(StatusCodes.OK).json({ prekes });
};

export const createPreke = async (req, res) => {
  const preke = await Prekes.create(req.body);
  res.status(StatusCodes.CREATED).json({ preke });
};

export const getPreke = async (req, res) => {
  const { id } = req.params;
  const preke = await Prekes.findById(id);
  if (!preke) throw new NotFoundError(`Tokios prekės su šiuo id: ${id} nėra`);
  res.status(StatusCodes.OK).json({ preke });
};

export const updatePreke = async (req, res) => {
  const { id } = req.params;
  const updatedPreke = await Prekes.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedPreke)
    throw new NotFoundError(`Tokios prekės su šiuo id: ${id} nėra`);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Atnaujinta prekė", preke: updatedPreke });
};
export const deletePreke = async (req, res) => {
  const { id } = req.params;
  const removedPreke = await Prekes.findByIdAndDelete(id);

  if (!removedPreke)
    throw new NotFoundError(`Tokios prekės su šiuo id: ${id} nėra`);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Ištrinta preke", preke: removedPreke });
};

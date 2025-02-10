import Klientai from "../models/KlientasModel.js";
import { StatusCodes } from "http-status-codes";

export const createKlientas = async (req, res) => {
  const klientas = await Klientai.create(req.body);
  res.status(StatusCodes.CREATED).json({ klientas });
};

export const getKlientas = async (req, res) => {
  const { id } = req.params;
  const klientas = await Klientai.findById(id);
  res.status(StatusCodes.OK).json({ klientas });
};

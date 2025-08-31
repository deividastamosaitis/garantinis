import Prekes, { MANUFACTURERS } from "../models/PrekeModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllPrekes = async (req, res) => {
  const prekes = await Prekes.find({}).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ prekes });
};

export const createPreke = async (req, res) => {
  const preke = await Prekes.create({
    ...req.body, // privalo turėti gamintojas, grupe
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ preke });
};

export const getPreke = async (req, res) => {
  const { id } = req.params;
  const preke = await Prekes.findById(id);
  res.status(StatusCodes.OK).json({ preke });
};

export const getPrekeByBarcode = async (req, res) => {
  const { barcode } = req.params;
  if (!barcode) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Barkodas yra privalomas" });
  }
  const preke = await Prekes.findOne({ barkodas: barcode });
  if (!preke) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Prekė su tokiu barkodu nerasta" });
  }
  res.status(StatusCodes.OK).json({ success: true, data: preke });
};

export const createOrUpdatePreke = async (req, res) => {
  const { barkodas, pavadinimas, gamintojas, grupe } = req.body;
  const userId = req.user.userId;

  if (!barkodas || !pavadinimas || !gamintojas || !grupe) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Barkodas, pavadinimas, gamintojas ir grupė yra privalomi",
    });
  }

  try {
    let preke = await Prekes.findOne({ barkodas });

    if (preke) {
      preke.pavadinimas = pavadinimas;
      preke.gamintojas = gamintojas;
      preke.grupe = grupe;
      await preke.save();
    } else {
      preke = await Prekes.create({
        barkodas,
        pavadinimas,
        gamintojas,
        grupe,
        createdBy: userId,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        _id: preke._id,
        barkodas: preke.barkodas,
        pavadinimas: preke.pavadinimas,
        gamintojas: preke.gamintojas,
        grupe: preke.grupe,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Serverio klaida išsaugant prekę",
    });
  }
};

export const updatePreke = async (req, res) => {
  const { id } = req.params;
  const updatedPreke = await Prekes.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Atnaujinta prekė", preke: updatedPreke });
};

export const deletePreke = async (req, res) => {
  const { id } = req.params;
  const removedPreke = await Prekes.findByIdAndDelete(id);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Ištrinta preke", preke: removedPreke });
};

// Naujas: meta endpoint gamintojams ir jų grupėms
export const getPrekesMeta = async (req, res) => {
  res.status(StatusCodes.OK).json({
    manufacturers: Object.keys(MANUFACTURERS),
    groupsByManufacturer: MANUFACTURERS,
  });
};

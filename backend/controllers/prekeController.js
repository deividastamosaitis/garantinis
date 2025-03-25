import Prekes from "../models/PrekeModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllPrekes = async (req, res) => {
  console.log(req.user);
  const prekes = await Prekes.find({});
  res.status(StatusCodes.OK).json({ prekes });
};

export const createPreke = async (req, res) => {
  const preke = await Prekes.create({
    ...req.body,
    createdBy: req.user.userId, // Assuming you have user in request
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
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Barkodas yra privalomas",
    });
  }

  try {
    const preke = await Prekes.findOne({ barkodas: barcode });

    if (!preke) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Prekė su tokiu barkodu nerasta",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: preke,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Serverio klaida ieškant prekės",
    });
  }
};

export const createOrUpdatePreke = async (req, res) => {
  const { barkodas, pavadinimas } = req.body;
  const userId = req.user.userId;

  if (!barkodas || !pavadinimas) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Barkodas ir pavadinimas yra privalomi",
    });
  }

  try {
    let preke = await Prekes.findOne({ barkodas });

    if (preke) {
      // Update existing product
      preke.pavadinimas = pavadinimas;
      await preke.save();
    } else {
      // Create new product
      preke = await Prekes.create({
        barkodas,
        pavadinimas,
        createdBy: userId,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        _id: preke._id,
        barkodas: preke.barkodas,
        pavadinimas: preke.pavadinimas,
      },
    });
  } catch (error) {
    if (error.message.includes("Barkodas jau egzistuoja")) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Serverio klaida išsaugant prekę",
    });
  }
};

export const updatePreke = async (req, res) => {
  const { id } = req.params;
  const updatedPreke = await Prekes.findByIdAndUpdate(id, req.body, {
    new: true,
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

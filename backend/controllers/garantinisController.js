import Garantinis from "../models/GarantinisModel.js";
import { StatusCodes } from "http-status-codes";
import Prekes from "../models/PrekeModel.js";

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
  const { klientas, prekes, atsiskaitymas, kvitas, saskaita, totalKaina } =
    req.body;
  const userId = req.user.userId;

  try {
    // First save/update all products
    await Promise.all(
      prekes.map(async (preke) => {
        if (preke.barkodas && preke.pavadinimas) {
          try {
            await Prekes.findOneAndUpdate(
              { barkodas: preke.barkodas },
              {
                pavadinimas: preke.pavadinimas,
                createdBy: userId,
              },
              { upsert: true, new: true }
            );
          } catch (error) {
            console.error(`Klaida išsaugant prekę ${preke.barkodas}:`, error);
          }
        }
      })
    );

    // Then create the garantinis record
    const garantinis = await Garantinis.create({
      klientas,
      prekes,
      atsiskaitymas,
      kvitas,
      saskaita,
      totalKaina,
      createdBy: userId,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: garantinis,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Klaida kuriant garantinį įrašą",
    });
  }
};

export const getGarantinis = async (req, res) => {
  try {
    const garantinis = await Garantinis.findById(req.params.id).populate(
      "createdBy",
      "vardas email"
    );

    if (!garantinis) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Garantinis not found",
      });
    }

    res.status(StatusCodes.OK).json({ garantinis });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch garantinis",
      error: error.message,
    });
  }
};

export const updateGarantinis = async (req, res) => {
  try {
    const updatedGarantinis = await Garantinis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("createdBy", "vardas email");

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Garantinis updated",
      garantinis: updatedGarantinis,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update garantinis",
      error: error.message,
    });
  }
};

export const deleteGarantinis = async (req, res) => {
  try {
    const garantinis = await Garantinis.findByIdAndDelete(req.params.id);

    if (!garantinis) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Garantinis nerastas",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Garantinis sėkmingai ištrintas",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Klaida trinant garantinį",
      error: error.message,
    });
  }
};

export const searchGarantinisByClient = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Search term is required",
      });
    }

    const garantinis = await Garantinis.find({
      $or: [
        { "klientas.vardas": { $regex: searchTerm, $options: "i" } },
        { "klientas.telefonas": { $regex: searchTerm, $options: "i" } },
      ],
    })
      .populate("createdBy", "vardas email")
      .sort({ createdAt: -1 });

    if (garantinis.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "No purchases found for this client",
        products: [],
        totalValue: 0,
        clientInfo: null,
      });
    }

    // Extract client info from the first matching record (assuming same client)
    const clientInfo = garantinis[0].klientas;

    // Extract all products and calculate total value
    let totalValue = 0;
    const allProducts = garantinis.reduce((acc, garantinisItem) => {
      const productsWithDate = garantinisItem.prekes.map((product) => {
        const productValue = product.kaina || 0;
        totalValue += productValue;

        return {
          ...(product.toObject ? product.toObject() : product),
          purchaseDate: garantinisItem.createdAt,
          garantinisId: garantinisItem._id,
        };
      });
      return acc.concat(productsWithDate);
    }, []);

    res.status(StatusCodes.OK).json({
      success: true,
      products: allProducts,
      totalValue,
      clientInfo,
      purchaseCount: garantinis.length, // Number of purchase records
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error searching client purchases",
      error: error.message,
    });
  }
};

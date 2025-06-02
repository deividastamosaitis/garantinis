import Garantinis from "../models/GarantinisModel.js";
import { StatusCodes } from "http-status-codes";
import Prekes from "../models/PrekeModel.js";

export const getAllGarantinis = async (req, res) => {
  const garantinis = await Garantinis.find({})
    .populate("createdBy", "vardas email") // Pridėkite vartotojo informaciją
    .sort({ createdAt: -1 }); // Rūšiuoti pagal datą (naujausi viršuje)

  garantinis
    .slice(0, 3)
    .forEach((g, i) => console.log(`🔹 [${i}]`, g.atsiskaitymas));

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

    garantinis
      .slice(0, 3)
      .forEach((g, i) => console.log(`🔸 [${i}]`, g.atsiskaitymas));
    res.status(StatusCodes.OK).json({ garantinis });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Klaida gaunant duomenis" });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Nurodykite pradžios ir pabaigos datas",
      });
    }

    // Tikslus datos filtro nustatymas su UTC laiku
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateFilter = {
      createdAt: {
        $gte: new Date(
          Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
        ),
        $lte: new Date(
          Date.UTC(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
            23,
            59,
            59,
            999
          )
        ),
      },
    };

    // Get total baskets count
    const totalBaskets = await Garantinis.countDocuments(dateFilter);

    const totalRevenueResult = await Garantinis.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalKaina" },
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    const basketsByDay = await Garantinis.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+03:00",
            },
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalKaina" },
          grynais: {
            $sum: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$atsiskaitymas",
                      as: "a",
                      cond: { $eq: ["$$a.tipas", "grynais"] },
                    },
                  },
                  as: "g",
                  in: "$$g.suma",
                },
              },
            },
          },
          kortele: {
            $sum: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$atsiskaitymas",
                      as: "a",
                      cond: { $eq: ["$$a.tipas", "kortele"] },
                    },
                  },
                  as: "k",
                  in: "$$k.suma",
                },
              },
            },
          },
          pavedimas: {
            $sum: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$atsiskaitymas",
                      as: "a",
                      cond: { $eq: ["$$a.tipas", "pavedimas"] },
                    },
                  },
                  as: "p",
                  in: "$$p.suma",
                },
              },
            },
          },
          lizingas: {
            $sum: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$atsiskaitymas",
                      as: "a",
                      cond: { $eq: ["$$a.tipas", "lizingas"] },
                    },
                  },
                  as: "l",
                  in: "$$l.suma",
                },
              },
            },
          },
          cod: {
            $sum: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$atsiskaitymas",
                      as: "a",
                      cond: { $eq: ["$$a.tipas", "COD"] },
                    },
                  },
                  as: "c",
                  in: "$$c.suma",
                },
              },
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const salesByProduct = await Garantinis.aggregate([
      { $match: dateFilter },
      { $unwind: "$prekes" },
      {
        $group: {
          _id: "$prekes.pavadinimas",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$prekes.kaina" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      totalBaskets,
      totalRevenue,
      basketsByDay,
      salesByProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Nepavyko gauti statistikos",
      error: error.message,
    });
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
        { "prekes.serial": { $regex: searchTerm, $options: "i" } },
      ],
    })
      .populate("createdBy", "vardas email")
      .sort({ createdAt: -1 });

    if (garantinis.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "No purchases found matching the search",
        products: [],
        totalValue: 0,
        clientInfo: null,
        searchType: null,
      });
    }

    // Determine search type (client or serial number)
    let searchType = "client";
    const isSerialSearch = garantinis.some((garantinisItem) =>
      garantinisItem.prekes.some(
        (product) =>
          product.serial &&
          product.serial.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (isSerialSearch) {
      searchType = "serial";
    }

    // Extract client info (for client search) or product info (for serial search)
    let clientInfo = null;
    let specificProduct = null;

    if (searchType === "client") {
      clientInfo = garantinis[0].klientas;
    } else {
      // Find the specific product that matched the serial number
      for (const garantinisItem of garantinis) {
        const foundProduct = garantinisItem.prekes.find(
          (product) =>
            product.serial &&
            product.serial.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (foundProduct) {
          specificProduct = {
            ...(foundProduct.toObject ? foundProduct.toObject() : foundProduct),
            purchaseDate: garantinisItem.createdAt,
            garantinisId: garantinisItem._id,
            clientInfo: garantinisItem.klientas,
          };
          break;
        }
      }
    }

    // Extract all products and calculate total value
    let totalValue = 0;
    const allProducts = garantinis.reduce((acc, garantinisItem) => {
      const productsWithInfo = garantinisItem.prekes.map((product) => {
        const productValue = product.kaina || 0;
        totalValue += productValue;

        return {
          ...(product.toObject ? product.toObject() : product),
          purchaseDate: garantinisItem.createdAt,
          garantinisId: garantinisItem._id,
          clientInfo: garantinisItem.klientas,
        };
      });

      // For serial search, only include matching products
      if (searchType === "serial") {
        return acc.concat(
          productsWithInfo.filter(
            (product) =>
              product.serial &&
              product.serial.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      return acc.concat(productsWithInfo);
    }, []);

    res.status(StatusCodes.OK).json({
      success: true,
      products: allProducts,
      totalValue,
      clientInfo,
      specificProduct,
      searchType,
      purchaseCount: garantinis.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error searching purchases",
      error: error.message,
    });
  }
};

export const getSalesStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Nurodykite pradžios ir pabaigos datas",
      });
    }

    const dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    // Sales by product aggregation
    const salesByProduct = await Garantinis.aggregate([
      { $match: dateFilter },
      { $unwind: "$prekes" },
      {
        $group: {
          _id: "$prekes.pavadinimas",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$prekes.kaina" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      salesByProduct,
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Nepavyko gauti statistikos",
      error: error.message,
    });
  }
};

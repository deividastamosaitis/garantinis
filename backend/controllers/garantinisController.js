import Garantinis from "../models/GarantinisModel.js";
import { StatusCodes } from "http-status-codes";
import Prekes from "../models/PrekeModel.js";
import { generateGarantinisPDF } from "../utils/pdfGenerator.js";
import { atidarytiGarantiniPasirasymui } from "../utils/fullyKiosk.js";
import ExcelJS from "exceljs";

export const getAllGarantinis = async (req, res) => {
  const garantinis = await Garantinis.find({})
    .populate("createdBy", "vardas email") // Pridėkite vartotojo informaciją
    .sort({ createdAt: -1 }); // Rūšiuoti pagal datą (naujausi viršuje)

  garantinis.slice(0, 3);
  // .forEach((g, i) => console.log(`🔹 [${i}]`, g.atsiskaitymas));

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

    garantinis.slice(0, 3);
    // .forEach((g, i) => console.log(`🔸 [${i}]`, g.atsiskaitymas));
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
  const {
    klientas,
    prekes,
    atsiskaitymas,
    kvitas,
    saskaita,
    totalKaina,
    signature,
    reikiaGarantinio,
  } = req.body;

  const userId = req.user.userId;

  try {
    // Įrašome / atnaujiname prekes
    await Promise.all(
      prekes.map(async (preke) => {
        if (preke.barkodas && preke.pavadinimas) {
          await Prekes.findOneAndUpdate(
            { barkodas: preke.barkodas },
            {
              pavadinimas: preke.pavadinimas,
              createdBy: userId,
            },
            { upsert: true, new: true }
          );
        }
      })
    );

    // Sukuriame garantinį įrašą
    const garantinis = await Garantinis.create({
      klientas,
      prekes,
      atsiskaitymas,
      kvitas,
      saskaita,
      totalKaina,
      createdBy: userId,
    });

    let pdfUrl = null;

    // Patikrinam ar reikia pasirašymo pagal checkbox'ą
    if (reikiaGarantinio) {
      pdfUrl = await generateGarantinisPDF(garantinis, signature);
      garantinis.pdfPath = pdfUrl;
      await garantinis.save();

      await atidarytiGarantiniPasirasymui(garantinis._id);
    } else {
      await garantinis.save();
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: garantinis,
      pdfUrl,
    });
  } catch (error) {
    console.error("Garantinio kūrimo klaida:", error);
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
    const { signature, ...updates } = req.body;

    const garantinis = await Garantinis.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate("createdBy", "vardas email");

    if (!garantinis) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Garantinis nerastas",
      });
    }

    // Patikrinam ar reikia pasirašymo
    const atsiskaitymoTipai = garantinis.atsiskaitymas.map((a) => a.tipas);
    const reikiaPasirasymo = atsiskaitymoTipai.some(
      (tipas) => tipas === "grynais" || tipas === "kortele"
    );

    let pdfUrl = garantinis.pdfPath;

    if (reikiaPasirasymo && signature) {
      pdfUrl = await generateGarantinisPDF(garantinis, signature);
      garantinis.pdfPath = pdfUrl;
      await garantinis.save();
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Garantinis atnaujintas",
      garantinis,
      pdfUrl,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Nepavyko atnaujinti garantinio",
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
export const updateGarantinisSignature = async (req, res) => {
  try {
    const { id } = req.params;
    const { signature } = req.body;

    const garantinis = await Garantinis.findById(id);
    if (!garantinis) {
      return res.status(404).json({ success: false, message: "Nerastas" });
    }

    // Tikrinam ar atsiskaitymas reikalauja parašo
    const atsiskaitymoTipai = garantinis.atsiskaitymas.map((a) => a.tipas);
    const reikiaPasirasymo = atsiskaitymoTipai.some(
      (tipas) => tipas === "grynais" || tipas === "kortele"
    );

    if (!reikiaPasirasymo) {
      return res.status(200).json({
        success: true,
        message: "Parašas nereikalingas šiam atsiskaitymo tipui",
        pdfUrl: garantinis.pdfPath || null,
      });
    }

    // Jei reikia — generuojam naują PDF su parašu
    const pdfUrl = await generateGarantinisPDF(garantinis, signature);
    garantinis.pdfPath = pdfUrl;
    await garantinis.save();

    res.status(200).json({ success: true, pdfUrl });
  } catch (err) {
    console.error("❌ Klaida atnaujinant parašą:", err);
    res.status(500).json({ success: false, message: "Serverio klaida" });
  }
};

export const resendGarantinisSignature = async (req, res) => {
  try {
    const garantinis = await Garantinis.findById(req.params.id);
    if (!garantinis) {
      return res
        .status(404)
        .json({ success: false, message: "Garantinis nerastas" });
    }

    // Patikrinti, ar reikia parašo
    const tipai = garantinis.atsiskaitymas.map((a) => a.tipas);
    const reikiaPasirasymo =
      tipai.includes("grynais") || tipai.includes("kortele");

    if (!reikiaPasirasymo) {
      return res.status(400).json({
        success: false,
        message: "Šiam įrašui nereikia pasirašymo",
      });
    }

    // Siunčiame į planšetę
    await atidarytiGarantiniPasirasymui(garantinis._id);

    res.status(200).json({ success: true, message: "Išsiųsta į planšetę" });
  } catch (err) {
    console.error("❌ Klaida siunčiant pakartotinai:", err);
    res.status(500).json({ success: false, message: "Serverio klaida" });
  }
};

export const downloadGarantinisExcel = async (req, res) => {
  try {
    const garantinis = await Garantinis.findById(req.params.id);
    if (!garantinis) {
      return res.status(404).json({ msg: "Garantinis nerastas" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Garantinis");

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const centerStyle = {
      vertical: "middle",
      horizontal: "center",
    };

    // Kliento duomenys viršuje
    sheet.addRow(["Vardas:", garantinis.klientas.vardas || ""]);
    sheet.addRow(["Telefonas:", garantinis.klientas.telefonas || ""]);
    sheet.addRow([]); // tuščia eilutė

    // Prekių antraštės
    const headerRow = sheet.addRow([
      "Barkodas",
      "Pavadinimas",
      "Serijos numeris",
    ]);
    headerRow.font = { bold: true };

    // Prekės
    garantinis.prekes.forEach((preke) => {
      sheet.addRow([
        preke.barkodas || "",
        preke.pavadinimas || "",
        preke.serial || "",
      ]);
    });

    // ➕ 3–4 tuščios eilutės rankiniam įrašymui
    const numEmptyRows = 4;
    for (let i = 0; i < numEmptyRows; i++) {
      sheet.addRow(["", "", ""]);
    }

    // Pritaikome stilių visoms užpildytoms eilutėms (taip pat ir tuščioms)
    sheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = centerStyle;
      });
    });

    // Automatinis stulpelių plotis
    sheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value?.toString().length || 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    // Atsisiuntimo nustatymai
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=garantinis_${garantinis._id}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ msg: "Klaida generuojant Excel", error });
  }
};

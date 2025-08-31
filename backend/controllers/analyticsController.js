import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Garantinis from "../models/GarantinisModel.js"; // kelias pas tave
import Prekes from "../models/PrekeModel.js";

const parseRange = (range, from, to) => {
  // jei nori, gali daryti ir serveryje pagal LT laiką; čia – paprasta UTC logika
  const now = new Date();
  let start, end;

  if (from && to) {
    start = new Date(from);
    end = new Date(to);
    // end exclusive (+1d)
    end = new Date(end.getTime() + 24 * 3600 * 1000);
    return { start, end };
  }

  switch (range) {
    case "week": {
      const d = new Date(now);
      const day = d.getUTCDay() || 7; // 1..7
      d.setUTCDate(d.getUTCDate() - day + 1);
      d.setUTCHours(0, 0, 0, 0);
      start = d;
      end = new Date();
      break;
    }
    case "month": {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      start = d;
      end = new Date();
      break;
    }
    case "quarter": {
      const q = Math.floor(now.getUTCMonth() / 3); // 0..3
      start = new Date(Date.UTC(now.getUTCFullYear(), q * 3, 1));
      end = new Date();
      break;
    }
    case "halfyear": {
      const hStartMonth = now.getUTCMonth() < 6 ? 0 : 6;
      start = new Date(Date.UTC(now.getUTCFullYear(), hStartMonth, 1));
      end = new Date();
      break;
    }
    case "year":
    default: {
      start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      end = new Date();
    }
  }
  return { start, end };
};

export const getSalesByGroup = async (req, res) => {
  try {
    const {
      range = "month",
      from,
      to,
      withManufacturer,
      manufacturer,
    } = req.query;
    const { start, end } = parseRange(range, from, to);

    const pipeline = [
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $unwind: "$prekes" },
      {
        $lookup: {
          from: "prekes",
          localField: "prekes.barkodas",
          foreignField: "barkodas",
          as: "prekeDoc",
        },
      },
      {
        $addFields: {
          prekeDoc: { $arrayElemAt: ["$prekeDoc", 0] },
          grupe: { $ifNull: ["$prekeDoc.grupe", "Nepriskirta"] },
          gamintojas: { $ifNull: ["$prekeDoc.gamintojas", "Nepriskirta"] },
        },
      },
    ];

    // ✅ jei nurodytas konkretus gamintojas – filtruojam
    if (manufacturer) {
      pipeline.push({ $match: { gamintojas: manufacturer } });
    }

    pipeline.push({
      $group: {
        _id:
          withManufacturer === "1"
            ? { grupe: "$grupe", gamintojas: "$gamintojas" }
            : { grupe: "$grupe" },
        vienetai: { $sum: 1 },
        bendraSuma: { $sum: "$prekes.kaina" },
      },
    });

    pipeline.push({
      $project: {
        _id: 0,
        grupe: "$_id.grupe",
        gamintojas: withManufacturer === "1" ? "$_id.gamintojas" : null,
        vienetai: 1,
        bendraSuma: { $round: ["$bendraSuma", 2] },
      },
    });

    pipeline.push({ $sort: { bendraSuma: -1 } });

    const data = await Garantinis.aggregate(pipeline);

    const totals = data.reduce(
      (acc, row) => {
        acc.vienetai += row.vienetai;
        acc.bendraSuma =
          Math.round((acc.bendraSuma + row.bendraSuma) * 100) / 100;
        return acc;
      },
      { vienetai: 0, bendraSuma: 0 }
    );

    res.status(StatusCodes.OK).json({
      range,
      from: start,
      to: end,
      manufacturer: manufacturer || null,
      rows: data,
      totals,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Nepavyko sugeneruoti ataskaitos", error: err.message });
  }
};

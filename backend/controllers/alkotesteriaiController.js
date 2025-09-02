import { StatusCodes } from "http-status-codes";
import Alkotesteris from "../models/AlkotesterisModel.js";
import { sendSms } from "../utils/infobipSms.js";
import { normalizeLtPhone, isLikelyMobileLt } from "../utils/phone.js";

export const getAllAlkotesteriai = async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};

  const alkotesteriai = await Alkotesteris.find(query).sort({
    lastUpdated: -1,
  });

  res.status(StatusCodes.OK).json({ alkotesteriai });
};

export const getTodayAlkotesteriai = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  try {
    const alkotesteriai = await Alkotesteris.find({
      registrationDate: { $gte: todayStart, $lte: todayEnd },
    }).sort({ registrationDate: -1 });

    res.status(StatusCodes.OK).json({ alkotesteriai });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Klaida gaunant šiandienos alkotesterius" });
  }
};

export const createAlkotesteris = async (req, res) => {
  try {
    const alkotesteris = await Alkotesteris.create(req.body);
    res.status(StatusCodes.CREATED).json({ alkotesteris });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Klaida kuriant alkotesterio įrašą" });
  }
};

export const getAlkotesteris = async (req, res) => {
  const { id } = req.params;
  const alkotesteris = await Alkotesteris.findById(id);

  if (!alkotesteris) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Alkotesteris su ID ${id} nerastas` });
  }

  res.status(StatusCodes.OK).json({ alkotesteris });
};

export const updateAlkotesteris = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAlkotesteris = await Alkotesteris.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedAlkotesteris) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Alkotesteris su ID ${id} nerastas` });
    }

    res.status(StatusCodes.OK).json({ alkotesteris: updatedAlkotesteris });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Klaida atnaujinant alkotesterio duomenis" });
  }
};

export const updateAlkotesterisStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAlkotesteris = await Alkotesteris.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAlkotesteris) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Alkotesteris su ID ${id} nerastas` });
    }

    res.status(StatusCodes.OK).json({ alkotesteris: updatedAlkotesteris });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Klaida atnaujinant alkotesterio būseną" });
  }
};

export const deleteAlkotesteris = async (req, res) => {
  const { id } = req.params;
  const alkotesteris = await Alkotesteris.findByIdAndDelete(id);

  if (!alkotesteris) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Alkotesteris su ID ${id} nerastas` });
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Alkotesteris sėkmingai ištrintas" });
};

export const searchAlkotesteriaiByClient = async (req, res) => {
  const { clientName, serialNumber } = req.query;
  let query = {};

  if (clientName) {
    query.clientName = { $regex: clientName, $options: "i" };
  }

  if (serialNumber) {
    query.serialNumber = { $regex: serialNumber, $options: "i" };
  }

  try {
    const alkotesteriai = await Alkotesteris.find(query).sort({
      lastUpdated: -1,
    });
    res.status(StatusCodes.OK).json({ alkotesteriai });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Klaida vykdant paiešką" });
  }
};

export const sendAlkotesterisSms = async (req, res) => {
  const { id } = req.params;

  const alk = await Alkotesteris.findById(id);
  if (!alk) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Alkotesteris su ID ${id} nerastas` });
  }

  // leidžiam siųsti tik kai "grįžęs"
  if (alk.status !== "grįžęs") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "SMS galima siųsti tik kai būsena yra „grįžęs“." });
  }

  const to = normalizeLtPhone(alk.clientPhone);
  if (!to || !isLikelyMobileLt(to)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        "Neteisingas telefono numeris. Reikalingas LT formatas, pvz.: 3706xxxxxxx",
    });
  }

  const text =
    req.body?.text ||
    `Sveiki, ${alk.clientName}! Jūsų alkotesteris po patikros jau grįžo ir paruoštas atsiėmimui. Darbo laikas: I-V: 9-18val, VI: 10-15val. Kaunas, Jonavos g. 204a +37037208164`;

  try {
    const result = await sendSms({ to, text });
    alk.lastSmsSentAt = new Date();
    await alk.save();
    return res.status(StatusCodes.OK).json({
      message: "SMS sėkmingai išsiųsta",
      lastSmsSentAt: alk.lastSmsSentAt,
      result,
    });
  } catch (err) {
    console.error("[Infobip SMS]", err.response?.data || err.message);
    const status = err.status || err.response?.status || 500;
    return res.status(status).json({
      message:
        err.response?.data?.requestError?.serviceException?.text ||
        err.message ||
        "Nepavyko išsiųsti SMS",
    });
  }
};

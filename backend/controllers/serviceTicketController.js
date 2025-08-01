import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import ServiceTicket from "../models/ServiceTicket.js";
import { sendEmail } from "../utils/sendEmail.js";
import axios from "axios";

function generateRmaCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 900 + 100); // 3 skaitmenys
  return `GPS_RMA${date}${random}`;
}

export const createServiceTicket = async (req, res) => {
  try {
    const { client, product, problemDescription, recaptchaToken } = req.body;

    // ✅ Sukuriam RMA kodą
    const rmaCode = generateRmaCode();

    // ✅ Sukuriam ir saugom į DB
    const ticket = new ServiceTicket({
      client,
      product: {
        ...product,
        externalService: {
          rmaCode,
          status: "Registruota",
        },
      },
      problemDescription,
    });

    await ticket.save();

    // (Pasirinktinai) siųsti el. laišką klientui čia

    res.status(201).json(ticket);
  } catch (err) {
    console.error("createServiceTicket klaida:", err.message);
    res.status(500).json({ error: "Serverio klaida. Bandykite vėliau." });
  }
};

export const getAllServiceTickets = async (req, res) => {
  const tickets = await ServiceTicket.find().sort({ receivedDate: -1 });
  res.json(tickets);
};

export const getServiceTicket = async (req, res) => {
  const ticket = await ServiceTicket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Nerasta" });
  res.json(ticket);
};

export const updateServiceTicket = async (req, res) => {
  const FIELD_LABELS = {
    "client.name": "Kliento vardas",
    "client.phone": "Telefono numeris",
    "client.email": "El. paštas",
    "product.category": "Kategorija",
    "product.brand": "Gamintojas",
    "product.model": "Modelis",
    "product.serialNumber": "Serijos numeris",
    "product.externalService.sentTo": "Tiekėjas",
    "product.externalService.sentDate": "Išsiuntimo data",
    "product.externalService.rmaCode": "Kliento RMA",
    "product.externalService.supplierRmaCode": "Tiekėjo RMA kodas",
    "product.externalService.status": "Išorinio serviso statusas",
    "product.externalService.returnDate": "Grąžinimo data",
    problemDescription: "Gedimo aprašymas",
    status: "Statusas",
    assignedTo: "Darbuotojas",
    notes: "Pastabos",
    attachments: "Prisegti failai",
  };

  let editorName = "Nežinomas";

  try {
    // ✅ Gauti vartotojo vardą iš JWT
    const token = req.cookies?.token;
    if (token) {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userId).select("vardas email");
      editorName = user?.vardas || user?.email || "Nežinomas";
    }

    const ticket = await ServiceTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Įrašas nerastas" });

    const update = req.body;
    const changes = [];

    // ✅ Klientas
    if (update.client) {
      for (const key in update.client) {
        const oldVal = ticket.client[key];
        const newVal = update.client[key];
        if (oldVal !== newVal) {
          changes.push({ field: `client.${key}`, old: oldVal, new: newVal });
          ticket.client[key] = newVal;
        }
      }
    }

    // ✅ Produktas
    if (update.product) {
      for (const key in update.product) {
        if (key === "externalService" && update.product.externalService) {
          const ext = update.product.externalService;
          const current = ticket.product.externalService || {};
          for (const ek in ext) {
            const oldVal = current[ek];
            const newVal = ext[ek];
            const isDateField = ek.toLowerCase().includes("date");

            const normalize = (val) =>
              val === undefined || val === null || val === "" ? null : val;

            const changed = isDateField
              ? normalize(oldVal) &&
                normalize(newVal) &&
                new Date(oldVal).toISOString().slice(0, 10) !==
                  new Date(newVal).toISOString().slice(0, 10)
              : normalize(oldVal) !== normalize(newVal);

            if (changed) {
              changes.push({
                field: `product.externalService.${ek}`,
                old: oldVal,
                new: newVal,
              });
              if (!ticket.product.externalService) {
                ticket.product.externalService = {};
              }
              ticket.product.externalService[ek] = newVal;
            }
          }
        } else {
          const oldVal = ticket.product[key];
          const newVal = update.product[key];
          if (oldVal !== newVal) {
            changes.push({
              field: `product.${key}`,
              old: oldVal,
              new: newVal,
            });
            ticket.product[key] = newVal;
          }
        }
      }
    }

    // ✅ Gedimo aprašymas
    if (
      update.problemDescription !== undefined &&
      update.problemDescription !== ticket.problemDescription
    ) {
      changes.push({
        field: "problemDescription",
        old: ticket.problemDescription,
        new: update.problemDescription,
      });
      ticket.problemDescription = update.problemDescription;
    }

    // ✅ Statusas
    if (update.status && update.status !== ticket.status) {
      changes.push({
        field: "status",
        old: ticket.status,
        new: update.status,
      });
      ticket.status = update.status;

      // El. laiškas klientui (jei yra el. paštas)
      if (ticket.client?.email) {
        const rma = ticket.product?.externalService?.rmaCode || "nežinomas";
        await sendEmail({
          to: ticket.client.email,
          rmaCode: rma,
          status: update.status,
          product: ticket.product,
          problemDescription: ticket.problemDescription,
        });
      }
    }

    // ✅ Darbuotojas
    if (update.assignedTo && update.assignedTo !== ticket.assignedTo) {
      changes.push({
        field: "assignedTo",
        old: ticket.assignedTo,
        new: update.assignedTo,
      });
      ticket.assignedTo = update.assignedTo;
    }

    // ✅ Pastabos
    if (update.notes && update.notes !== ticket.notes) {
      changes.push({
        field: "notes",
        old: ticket.notes,
        new: update.notes,
      });
      ticket.notes = update.notes;
    }

    // ✅ Prisegti failai (attachments)
    if (Array.isArray(update.attachments)) {
      const old = ticket.attachments || [];
      const newVal = update.attachments;

      if (JSON.stringify(old) !== JSON.stringify(newVal)) {
        changes.push({
          field: "attachments",
          old,
          new: newVal,
        });
        ticket.attachments = newVal;
      }
    }

    // ✅ Į istoriją įrašom visas reikšmingas korekcijas
    for (const c of changes) {
      const fieldLabel = FIELD_LABELS[c.field] || c.field;
      ticket.history.push({
        date: new Date(),
        type: "field",
        from: editorName,
        status: ticket.status,
        note: `Laukas "${fieldLabel}" pakeistas: "${c.old || "—"}" → "${
          c.new
        }"`,
      });
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error("❌ updateServiceTicket klaida:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Papildoma funkcija – pašalina tuščius laukus
function sanitize(obj) {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );
}

export const deleteServiceTicket = async (req, res) => {
  await ServiceTicket.findByIdAndDelete(req.params.id);
  res.json({ message: "Ištrinta" });
};

export const updateExternalServiceInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { sentTo, sentDate, rmaCode, status, returnDate } = req.body;

    const ticket = await ServiceTicket.findById(id);
    if (!ticket) return res.status(404).json({ error: "Nerasta" });

    ticket.product.externalService = {
      sentTo,
      sentDate,
      rmaCode,
      status,
      returnDate,
    };

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const sendClientInquiry = async (req, res) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Įrašas nerastas" });

    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Užklausos tekstas negali būti tuščias." });
    }

    if (!ticket.client?.email) {
      return res
        .status(400)
        .json({ error: "Klientas neturi el. pašto adreso." });
    }

    const subject = `❓ Klausimas dėl Jūsų RMA – ${
      ticket.product?.externalService?.rmaCode || "Nežinomas"
    }`;
    const emailText = `
Sveiki,

Turime klausimą/papildomą užklausą dėl Jūsų remonto:

${message}

Jei turite papildomų klausimų – atsakykite į šį laišką.

GPSmeistras Servisas,
UAB Todesa
Jonavos g. 204A, Kaunas
+370 37208164
`;

    await sendEmail({
      to: ticket.client.email,
      rmaCode: ticket.product?.externalService?.rmaCode,
      message,
      type: "inquiry",
    });

    // Istorijai įrašyti (kas siuntė)
    let editorName = "Nežinomas";
    const token = req.cookies?.token;
    if (token) {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userId).select("vardas pavarde email");
      editorName = user?.vardas || user?.email || "Nežinomas";
    }

    ticket.history.push({
      date: new Date(),
      type: "inquiry",
      from: editorName,
      note: `Išsiųsta užklausa klientui: "${message}"`,
    });

    await ticket.save();

    res.json({ msg: "Laiškas išsiųstas" });
  } catch (err) {
    console.error("❌ Užklausos siuntimo klaida:", err.message);
    res.status(500).json({ error: "Nepavyko išsiųsti užklausos" });
  }
};

export const addClientReply = async (req, res) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Įrašas nerastas" });

    const { reply } = req.body;
    if (!reply || reply.trim().length === 0)
      return res.status(400).json({ error: "Atsakymas negali būti tuščias." });

    let editorName = "Nežinomas";
    const token = req.cookies?.token;
    if (token) {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userId).select("vardas email");
      editorName = user?.vardas || user?.email || "Nežinomas";
    }

    ticket.history.push({
      date: new Date(),
      type: "inquiry-reply",
      from: editorName,
      note: `Kliento atsakymas: "${reply}"`,
    });

    await ticket.save();
    res.json({ msg: "Atsakymas įrašytas" });
  } catch (err) {
    console.error("❌ Klaida saugant atsakymą:", err.message);
    res.status(500).json({ error: "Nepavyko išsaugoti atsakymo" });
  }
};

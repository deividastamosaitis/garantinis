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

    // 🔐 Tikrinam ReCAPTCHA tokeną
    // if (!recaptchaToken) {
    //   return res.status(400).json({ error: "Nepateiktas ReCAPTCHA tokenas" });
    // }

    // const recaptchaRes = await axios.post(
    //   `https://www.google.com/recaptcha/api/siteverify`,
    //   new URLSearchParams({
    //     secret: process.env.RECAPTCHA_SECRET,
    //     response: recaptchaToken,
    //   })
    // );

    // if (!recaptchaRes.data.success) {
    //   return res
    //     .status(400)
    //     .json({ error: "ReCAPTCHA klaida, bandykite iš naujo" });
    // }

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
  };
  try {
    const ticket = await ServiceTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Įrašas nerastas" });

    const update = req.body;
    const changes = [];

    // Klientas
    if (update.client) {
      for (const key in update.client) {
        const oldVal = ticket.client[key];
        const newVal = update.client[key];

        if (oldVal !== newVal) {
          changes.push({
            field: `client.${key}`,
            old: oldVal,
            new: newVal,
          });
          ticket.client[key] = newVal;
        }
      }
    }

    // Produktas
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

    // Gedimo aprašymas
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

    // Statusas
    if (update.status && update.status !== ticket.status) {
      changes.push({
        field: "status",
        old: ticket.status,
        new: update.status,
      });
      ticket.status = update.status;

      // Siunčiam el. laišką klientui apie statuso pasikeitimą
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

    // Priskirtas darbuotojas
    if (update.assignedTo && update.assignedTo !== ticket.assignedTo) {
      changes.push({
        field: "assignedTo",
        old: ticket.assignedTo,
        new: update.assignedTo,
      });
      ticket.assignedTo = update.assignedTo;
    }

    // Pastabos
    if (update.notes && update.notes !== ticket.notes) {
      changes.push({
        field: "notes",
        old: ticket.notes,
        new: update.notes,
      });
      ticket.notes = update.notes;
    }

    // Istorijos įrašas
    for (const c of changes) {
      const fieldLabel = FIELD_LABELS[c.field] || c.field;
      ticket.history.push({
        date: new Date(),
        type: "field",
        from: "Admin",
        status: ticket.status,
        note: `Laukas "${fieldLabel}" pakeistas: "${c.old || "—"}" → "${
          c.new
        }"`,
      });
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error("updateServiceTicket klaida:", err.message);
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

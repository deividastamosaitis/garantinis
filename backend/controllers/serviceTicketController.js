import ServiceTicket from "../models/ServiceTicket.js";

export const createServiceTicket = async (req, res) => {
  try {
    const ticket = new ServiceTicket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
  try {
    const ticket = await ServiceTicket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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

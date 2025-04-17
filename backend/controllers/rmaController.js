import { StatusCodes } from "http-status-codes";
import Product from "../models/ProductModel.js";
import Customer from "../models/CustomerModel.js";
import axios from "axios";

export const createRMA = async (req, res) => {
  const { customerData, productData } = req.body;

  const customer = await Customer.create(customerData);
  const product = await Product.create({
    ...productData,
    customer: customer._id,
  });

  res.status(StatusCodes.CREATED).json({ product, customer });
};

export const getAllRMA = async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};

  const products = await Product.find(query)
    .populate("customer")
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({ products });
};

export const getRMA = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("customer");

  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "RMA įrašas nerastas" });
  }

  res.status(StatusCodes.OK).json({ product });
};

export const updateRMA = async (req, res) => {
  const { status, notified, epromaRMA, additionalInfo } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status, notified, epromaRMA, additionalInfo },
    { new: true }
  ).populate("customer");

  res.status(StatusCodes.OK).json({ product });
};

export const deleteRMA = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ msg: "RMA įrašas sėkmingai ištrintas" });
};

export const checkEpromaStatus = async (req, res) => {
  try {
    const response = await axios.get(
      `https://eproma.lt/lt/module/registerforrepair/status?reference=${req.params.rmaCode}`
    );
    // Adaptuokite pagal eproma.lt atsakymo formatą
    res.status(StatusCodes.OK).json({ status: response.data.status });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Klaida tikrinant eproma.lt statusą",
      error: err.message,
    });
  }
};

export const scheduleEpromaStatusCheck = async () => {
  const products = await Product.find({
    epromaRMA: { $exists: true, $ne: null },
  });

  for (const product of products) {
    try {
      const response = await axios.get(
        `https://eproma.lt/lt/module/registerforrepair/status?reference=${product.epromaRMA}`
      );
      product.epromaStatus = response.data.status || "Nepavyko gauti statuso";
      await product.save();
    } catch (err) {
      console.error(
        `Error checking status for RMA ${product.epromaRMA}:`,
        err.message
      );
      product.epromaStatus = "Klaida tikrinant statusą";
      await product.save();
    }
  }
};

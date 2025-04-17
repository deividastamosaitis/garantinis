import { body, param, query } from "express-validator";
import mongoose from "mongoose";

// Bendros validacijos funkcijos
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const notEmpty = (value) => value && value.trim() !== "";

// RMA kūrimo ir atnaujinimo validacija
export const rmaDataValidation = [
  body("customerData.name")
    .notEmpty()
    .withMessage("Kliento vardas yra privalomas")
    .isLength({ min: 2, max: 50 })
    .withMessage("Vardas turi būti 2-50 simbolių"),

  body("customerData.email")
    .optional()
    .isEmail()
    .withMessage("Neteisingas el. pašto formatas"),

  body("customerData.phone")
    .notEmpty()
    .withMessage("Telefono numeris yra privalomas")
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    .withMessage("Neteisingas telefono numerio formatas"),

  body("productData.name")
    .notEmpty()
    .withMessage("Prekės pavadinimas yra privalomas")
    .isLength({ max: 100 })
    .withMessage("Pavadinimas per ilgas"),

  body("productData.serialNumber")
    .notEmpty()
    .withMessage("Serijinis numeris yra privalomas")
    .isLength({ min: 3, max: 50 })
    .withMessage("Serijinis numeris turi būti 3-50 simbolių"),

  body("productData.accessories")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Komplektacijos aprašymas per ilgas"),

  body("productData.status")
    .isIn(["registered", "sent", "returned", "credit"])
    .withMessage("Neteisinga būsena"),

  body("productData.notified")
    .isIn(["notified", "not_notified"])
    .withMessage("Neteisinga pranešimo būsena"),

  body("productData.epromaRMA")
    .optional()
    .isLength({ max: 50 })
    .withMessage("RMA kodas per ilgas"),

  body("productData.additionalInfo")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Papildoma informacija per ilga"),
];

// ID validacija
export const idValidation = [
  param("id").custom(isValidObjectId).withMessage("Neteisingas ID formatas"),
];

// RMA kodo validacija
export const rmaCodeValidation = [
  param("rmaCode")
    .notEmpty()
    .withMessage("RMA kodas yra privalomas")
    .isLength({ min: 3, max: 50 })
    .withMessage("RMA kodas turi būti 3-50 simbolių"),
];

// Filtravimo validacija
export const filterValidation = [
  query("status")
    .optional()
    .isIn(["registered", "sent", "returned", "credit"])
    .withMessage("Neteisinga filtro būsena"),
];

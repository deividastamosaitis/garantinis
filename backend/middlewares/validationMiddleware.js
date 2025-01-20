import User from "../models/UserModel.js";
import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { PREKE_KATEGORIJA } from "../utils/constants.js";
import mongoose from "mongoose";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateRegisterInput = withValidationErrors([
  body("vardas").notEmpty().withMessage("Būtinas vardas"),
  body("email")
    .notEmpty()
    .withMessage("Būtinas el.paštas")
    .isEmail()
    .withMessage("Neteisingas el.paštas")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("Toks el.pastas jau yra");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Butinas slaptažodis")
    .isLength({ min: 8 })
    .withMessage("Slaptažodis turi būti iš daugiau nei 8 skaitmenų"),
  body("pavarde").notEmpty().withMessage("Butina pavarde"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Pamiršai įvesti el.paštą")
    .isEmail()
    .withMessage("Tokio registruoto el.pašto nėra"),
  body("password").notEmpty().withMessage("Pamiršai įvesti slaptažodį"),
]);

export const validatePrekeInput = withValidationErrors([
  body("barkodas").notEmpty().withMessage("Būtinas prekės barkodas"),
  body("pavadinimas").notEmpty().withMessage("Būtinas prekės pavadinimas"),
  body("barkodas").notEmpty().withMessage("Būtinas barkodas"),
  body("kategorija")
    .isIn(Object.values(PREKE_KATEGORIJA))
    .withMessage("Būtina pasirinkti kategorija"),
]);

export const validateIdParam = withValidationErrors([
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Blogas MongoDB id"),
]);

import User from "../models/UserModel.js";
import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { PREKE_KATEGORIJA } from "../utils/constants.js";
import mongoose from "mongoose";
import Prekes from "../models/PrekeModel.js";
import Klientai from "../models/KlientasModel.js";
import Garantinis from "../models/GarantinisModel.js";
import Alkotesteris from "../models/AlkotesterisModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        if (errorMessages[0].startsWith("Tokios prekės")) {
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
]);
export const validateKlientasInput = withValidationErrors([
  body("vardas").notEmpty().withMessage("Būtinas klientas vardas"),
  body("telefonas").notEmpty().withMessage("Būtinas kliento telefonas"),
  body("miestas").notEmpty().withMessage("Būtinas kliento miestas"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("Blogas MongoDB id");
    const preke = await Prekes.findById(value);
    if (!preke)
      throw new NotFoundError(`Tokios prekės su šiuo id: ${value} nėra`);

    // const isAdmin = req.user.role === "admin";
    // if (!isAdmin)
    //   throw new UnauthorizedError("not autorized to access this route");
  }),
]);
export const validateKlientasIdParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("Blogas MongoDB id");
    const klientas = await Klientai.findById(value);
    if (!klientas)
      throw new NotFoundError(`Tokios prekės su šiuo id: ${value} nėra`);

    // const isAdmin = req.user.role === "admin";
    // if (!isAdmin)
    //   throw new UnauthorizedError("not autorized to access this route");
  }),
]);
export const validateGarantinisIdParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("Blogas MongoDB id");
    const garantinis = await Garantinis.findById(value);
    if (!garantinis)
      throw new NotFoundError(`Tokios prekės su šiuo id: ${value} nėra`);

    // const isAdmin = req.user.role === "admin";
    // if (!isAdmin)
    //   throw new UnauthorizedError("not autorized to access this route");
  }),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("vardas").notEmpty().withMessage("Būtinas vardas"),
  body("email")
    .notEmpty()
    .withMessage("Būtinas el.paštas")
    .isEmail()
    .withMessage("Neteisingas el.paštas")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("Toks el.pastas jau yra");
      }
    }),
  body("pavarde").notEmpty().withMessage("Butina pavarde"),
]);

export const validateAlkotesterisIdParam = async (req, res, next) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Netinkamas alkotesterio ID formatas" });
  }

  const alkotesteris = await Alkotesteris.findById(id);
  if (!alkotesteris) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `Alkotesteris su ID ${id} nerastas` });
  }

  next();
};

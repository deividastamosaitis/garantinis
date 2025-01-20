import { StatusCodes } from "http-status-codes";
import Preke from "../models/PrekeModel.js";
import User from "../models/UserModel.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const prekes = await Preke.countDocuments();
  res.status(StatusCodes.OK).json({ users, prekes });
};
export const updateUser = async (req, res) => {
  const obj = { ...req.body };
  delete obj.password;
  console.log(obj);
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, obj);
  res.status(StatusCodes.OK).json({ msg: "Update user" });
};

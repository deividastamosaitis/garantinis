import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token not found" });
  }

  // imam token
  const token = authorization.split(" ")[1];

  try {
    //decode id from token
    const { _id } = jwt.verify(token, process.env.SECRET);
    //save user in request
    req.user = await User.findById(_id).select("_id");

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default auth;

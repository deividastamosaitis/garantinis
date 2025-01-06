import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

/*******JWT */
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

/*******************Registraacija */
const registerUser = async (req, res) => {
  //imam data is body
  const { email, password } = req.body;

  //tikrinam ar pilnai uzpilde
  if (!email || !password) {
    return res.status(400).json({ error: "Visi langai turi buti uzpildyti" });
  }

  //tikrinam ar yra email
  const exist = await User.findOne({ email });
  if (exist) {
    return res.status(400).json({ error: "Toks vartotojas jau yra" });
  }

  //hash password
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);

  try {
    //registruoti user
    const user = await User.create({ email, password: hashed });
    //kuriam jwt
    const token = createToken(user._id);
    //atsakymas
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*******************Login */
const loginUser = async (req, res) => {
  //imam data is body
  const { email, password } = req.body;

  //tikrinam ar pilnai uzpilde
  if (!email || !password) {
    return res.status(400).json({ error: "Visi langai turi buti uzpildyti" });
  }

  //tikrinam ar yra email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Blogas email arba slaptazodis" });
  }

  //tikrinam password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Blogas email arba slaptazodis" });
  }

  try {
    //naudojam jwt
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registerUser, loginUser };

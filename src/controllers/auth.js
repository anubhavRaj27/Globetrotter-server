import bcrypt from "bcryptjs";
import Auth from "../models/auth.model.js";
import User from "../models/user.model.js";
import { randomUserId } from "../utils/common.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (await Auth.exists({ email })) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const userId = randomUserId();
    const hash = await bcrypt.hash(password, 10);

    await Auth.create({ userId, email, passwordHash: hash });
    await User.create({
      userId,
      email: email,
      userName: name,
      correct: 0,
      incorrect: 0,
      cities: [],
      friends: [],
    });
    res.status(201).json({ userId: userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await Auth.findOne({ email });
    if (!auth) return res.status(400).json({ error: "User Does not exist" });
    const isMatch = await bcrypt.compare(password, auth.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    const user= await User.findOne({email});
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECERT_KEY);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

// @desc Register a new user
export const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "user already exists" });

    const user = await user.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc user login
export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
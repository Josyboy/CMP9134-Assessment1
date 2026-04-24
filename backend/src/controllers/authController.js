import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/token.js";

export const registerUser = async (req, res) => {
  try {
    const { forename, email, password } = req.body;

    if (!forename || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Forename, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      forename,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: {
        id: user._id,
        forename: user.forename,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      token,
      data: {
        id: user._id,
        forename: user.forename,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signin failed",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Signout successful",
  });
};

import express from "express";
const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  refreshToAccessToken,
} from "../services/auth.js";

// CREATE one
router.post("/register", async (req, res) => {
  // ------------bcrypt--------------
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  // ----------end of bcrypt---------

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    following: req.body.following,
  });
  try {
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    console.log(user);
    if (user) {
      const validate = await bcrypt.compare(req.body.password, user.password);

      if (validate) {
        const u = {
          name: req.body.name,
          password: user.password,
        };
        const token = await generateAccessToken(u);
        const refreshToken = await generateRefreshToken(u);

        res.status(200).json({
          message: "logged in",
          token: token,
          refreshToken: refreshToken,
        });
      } else {
        res.status(400).json({ message: "Wrong Credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/token", refreshToAccessToken, async (req, res) => {});

export default router;

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ username, password });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Refresh token
router.post("/refresh-token", auth.verifyRefreshToken, (req, res) => {
  const user = req.user;
  const accessToken = generateAccessToken(user);
  res.json({ accessToken });
});

module.exports = router;

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const imageUpload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_DIR); // Directory where photos will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Append timestamp to avoid file name conflicts
  },
});

const upload = multer({ storage });

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
    const { username, password, email } = req.body;
    // const photoUrl = req.file ? `/uploads/${req.file.filename}` : ""; //URL to access the  photo

    console.log(req.body, "\n file is :", req.file);

    // let user = await User.findOne({ email });
    // if (user) return res.status(400).json({ message: "User already exists" });

    // const verificationCode = crypto.randomInt(100000, 999999).toString();
    // user = new User({
    //   username,
    //   email,
    //   password,
    //   photoUrl,
    //   verificationCode,
    //   verificationCodeExpires: Date.now() + 60000,
    // }); // 1 min
    const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);
    // await user.save();

    // email send
    // await sendVerificationEmail(user, verificationCode);

    // const accessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

    // res.status(201).json({ accessToken, refreshToken });
    res.status(201).json({ accessToken: "a", refreshToken: "r" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// verify email
router.post("/verify-email", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // if i don't wanna give resend option
    // if (user.verificationCodeExpires < Date.now()) {
    //   return res.status(400).json({ message: 'Verification code has expired' });
    // }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login a user
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

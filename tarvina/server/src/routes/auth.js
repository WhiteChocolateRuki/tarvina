const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = require("../middleware/authMiddleware");

function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password zorunlu" });
    }
    if (!isEmail(email))
      return res.status(400).json({ error: "email formatı geçersiz" });
    if (password.length < 6)
      return res.status(400).json({ error: "şifre en az 6 karakter olmalı" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "email zaten kayıtlı" });

    const passwordHash = await bcrypt.hash(password, 10);
    const u = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // ✅ JWT payload artık _id ile
    const token = jwt.sign(
      { _id: u._id, name: u.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: u._id,  // ✅ id yerine _id
        name: u.name,
        email: u.email,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "register hata" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email ve password zorunlu" });

    const u = await User.findOne({ email: email.toLowerCase() });
    if (!u) return res.status(400).json({ error: "bilgiler hatalı" });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(400).json({ error: "bilgiler hatalı" });

    const token = jwt.sign(
      { _id: u._id, name: u.name },   // ✅ burada da _id
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { _id: u._id, name: u.name, email: u.email }, // ✅ id yerine _id
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "login hata" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const u = await User.findById(req.user._id).select("_id name email createdAt"); // ✅ id yerine _id
  res.json({ user: u });
});

module.exports = router;

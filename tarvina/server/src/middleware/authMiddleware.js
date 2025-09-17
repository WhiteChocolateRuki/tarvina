const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { _id, name } ✅
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid token" });
  }
};

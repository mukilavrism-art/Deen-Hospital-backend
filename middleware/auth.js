// backend/middleware/auth.js
const adminAuth = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

  if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  next();
};

module.exports = { adminAuth };
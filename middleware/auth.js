// Simple admin authentication middleware
// For production, use JWT tokens or session-based auth
const adminAuth = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
  
  if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  
  next();
};

module.exports = { adminAuth };

// For more secure implementation with JWT:
/*
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
*/

// module.exports = { adminAuth };
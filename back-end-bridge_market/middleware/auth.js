const jwt = require("jsonwebtoken")
const db = require("../lib/db")

// Middleware to verify JWT token
const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization")
    if (!authHeader) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader

    if (!token) {
      return res.status(401).json({ error: "Authentication required" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_here")

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token" })
    }

    // Get user from database using db.getOne instead of User.getById
    const user = await db.getOne("SELECT * FROM users WHERE user_id = ?", [decoded.userId])

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error.message)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" })
    }

    res.status(401).json({ error: "Authentication failed" })
  }
}

// Middleware to check user role
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    next()
  }
}

module.exports = {
  isAuthenticated,
  hasRole,
}
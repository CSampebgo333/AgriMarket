const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../lib/db")
const { isAuthenticated } = require("../middleware/auth")

// Register a new user
router.post("/register", async (req, res, next) => {
  try {
    const { user_name, email, password, user_type, phone_number, country } = req.body

    // Validate required fields
    if (!user_name || !email || !password || !user_type) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check if user already exists
    const existingUser = await db.getOne("SELECT * FROM users WHERE email = ?", [email])
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const userId = await db.insert("users", {
      user_name,
      email,
      password: hashedPassword,
      user_type,
      phone_number: phone_number || null,
      country: country || null,
      is_verified: false,
      joined_date: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || "your_jwt_secret_key_here", { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        name: user_name,
        email,
        user_type,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    next(error)
  }
})

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Get user by email
    const user = await db.getOne("SELECT * FROM users WHERE email = ?", [email])
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET || "your_jwt_secret_key_here", {
      expiresIn: "7d",
    })

    // Update last login time
    await db.update("users", { last_login: new Date() }, { user_id: user.user_id })

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.email,
        user_type: user.user_type,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    next(error)
  }
})

// Get current user profile
router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    // User is already attached to req by isAuthenticated middleware
    const user = req.user

    // Remove sensitive information
    const userResponse = {
      user_id: user.user_id,
      user_name: user.user_name,
      email: user.email,
      user_type: user.user_type,
      phone_number: user.phone_number,
      country: user.country,
      profile_image: user.profile_image,
      is_verified: user.is_verified,
      joined_date: user.joined_date,
      last_login: user.last_login,
    }

    res.json(userResponse)
  } catch (error) {
    console.error("Get profile error:", error)
    next(error)
  }
})

// Logout - Just a placeholder as JWT tokens are stateless
router.post("/logout", isAuthenticated, (req, res) => {
  res.json({ message: "Logged out successfully" })
})

module.exports = router
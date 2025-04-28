const express = require("express")
const router = express.Router()
const { isAuthenticated } = require("../middleware/auth")
const db = require("../lib/db")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile_images')
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
  }
})

// Upload profile image
router.post("/profile/image", isAuthenticated, upload.single('image'), async (req, res, next) => {
  try {
    if (req.user.user_type !== "Customer") {
      return res.status(403).json({ error: "Access denied. User is not a customer." })
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" })
    }

    const userId = req.user.user_id
    const imagePath = `/uploads/profile_images/${req.file.filename}`

    // Update user's profile image
    await db.query(
      "UPDATE users SET profile_image = ? WHERE user_id = ?",
      [imagePath, userId]
    )

    res.json({
      message: "Profile image updated successfully",
      imageUrl: imagePath
    })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    next(error)
  }
})

// Get customer profile
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a customer
    if (req.user.user_type !== "Customer") {
      return res.status(403).json({ error: "Access denied. User is not a customer." })
    }

    const userId = req.user.user_id

    // Get the user data
    const userData = await db.getOne("SELECT * FROM users WHERE user_id = ?", [userId])

    // Split user_name into first and last name
    const [first_name, last_name] = userData.user_name ? userData.user_name.split(' ') : ['', '']

    res.json({
      firstName: first_name || "",
      lastName: last_name || "",
      email: userData.email || "",
      phone: userData.phone_number || "",
      profileImage: userData.profile_image || "",
    })
  } catch (error) {
    console.error("Error fetching customer profile:", error)
    next(error)
  }
})

// Update customer profile
router.put("/profile", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a customer
    if (req.user.user_type !== "Customer") {
      return res.status(403).json({ error: "Access denied. User is not a customer." })
    }

    const userId = req.user.user_id
    const { firstName, lastName, email, phone } = req.body

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["firstName", "lastName", "email"]
      })
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await db.getOne("SELECT * FROM users WHERE email = ? AND user_id != ?", [email, userId])
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" })
      }
    }

    // Update user fields
    await db.query(
      "UPDATE users SET user_name = ?, email = ?, phone_number = ? WHERE user_id = ?",
      [`${firstName} ${lastName}`, email, phone, userId]
    )

    res.json({
      message: "Profile updated successfully",
      profile: {
        firstName,
        lastName,
        email,
        phone,
        profileImage: req.user.profile_image || "",
      },
    })
  } catch (error) {
    console.error("Error updating customer profile:", error)
    next(error)
  }
})

module.exports = router 
const express = require("express")
const router = express.Router()
const User = require("../models/user")
const { isAuthenticated, hasRole } = require("../middleware/auth")
const { body, validationResult } = require("express-validator")
const { ApiError } = require("../middleware/error")

// Get all users (Admin only)
router.get("/", isAuthenticated, hasRole(["Admin"]), async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const filters = {
      user_type: req.query.user_type,
      country: req.query.country,
      search: req.query.search,
    }

    const result = await User.getAll(page, limit, filters)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Get user by ID (Admin only)
router.get("/:id", isAuthenticated, hasRole(["Admin"]), async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.getFullDetails(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
})

// Update user (Admin only)
router.put(
  "/:id",
  isAuthenticated,
  hasRole(["Admin"]),
  [
    body("user_name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("user_type").optional().isIn(["Customer", "Seller", "Admin", "Logistician"]).withMessage("Invalid user type"),
    body("is_verified").optional().isBoolean().withMessage("is_verified must be a boolean"),
  ],
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.params.id

      // Check if user exists
      const existingUser = await User.getById(userId)
      if (!existingUser) {
        throw new ApiError(404, "User not found")
      }

      // If email is being changed, check if it's already in use
      if (req.body.email && req.body.email !== existingUser.email) {
        const userWithEmail = await User.getByEmail(req.body.email)
        if (userWithEmail && userWithEmail.user_id !== Number.parseInt(userId)) {
          throw new ApiError(400, "Email already in use")
        }
      }

      // Update user
      await User.update(userId, req.body)

      // Get updated user
      const updatedUser = await User.getFullDetails(userId)

      res.json({
        message: "User updated successfully",
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
)

// Delete user (Admin only)
router.delete("/:id", isAuthenticated, hasRole(["Admin"]), async (req, res, next) => {
  try {
    const userId = req.params.id

    // Check if user exists
    const existingUser = await User.getById(userId)
    if (!existingUser) {
      throw new ApiError(404, "User not found")
    }

    // Prevent deleting self
    if (userId === req.user.user_id.toString()) {
      throw new ApiError(400, "Cannot delete your own account")
    }

    // Delete user
    await User.delete(userId)

    res.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
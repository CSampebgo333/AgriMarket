const express = require("express")
const router = express.Router()
const Customer = require("../models/customer")
const { isAuthenticated, hasRole } = require("../middleware/auth")
const { ApiError } = require("../middleware/error")

// Get all customers (Admin only)
router.get("/", isAuthenticated, hasRole(["Admin"]), async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const result = await Customer.findAll(page, limit)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Get customer by ID (Admin or the customer themselves)
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const customerId = req.params.id

    // Check if user is authorized to view this profile
    if (req.user.user_type !== "Admin" && req.user.user_id.toString() !== customerId) {
      throw new ApiError(403, "Not authorized to view this profile")
    }

    const customer = await Customer.findById(customerId)

    if (!customer) {
      throw new ApiError(404, "Customer not found")
    }

    res.json(customer)
  } catch (error) {
    next(error)
  }
})

// Get customer's orders (Admin or the customer themselves)
router.get("/:id/orders", isAuthenticated, async (req, res, next) => {
  try {
    const customerId = req.params.id

    // Check if user is authorized to view these orders
    if (req.user.user_type !== "Admin" && req.user.user_id.toString() !== customerId) {
      throw new ApiError(403, "Not authorized to view these orders")
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const result = await Customer.getOrders(customerId, page, limit)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Get customer's wishlist (Admin or the customer themselves)
router.get("/:id/wishlist", isAuthenticated, async (req, res, next) => {
  try {
    const customerId = req.params.id

    // Check if user is authorized to view this wishlist
    if (req.user.user_type !== "Admin" && req.user.user_id.toString() !== customerId) {
      throw new ApiError(403, "Not authorized to view this wishlist")
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const result = await Customer.getWishlist(customerId, page, limit)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Add product to wishlist
router.post("/:id/wishlist", isAuthenticated, async (req, res, next) => {
  try {
    const customerId = req.params.id

    // Check if user is authorized to modify this wishlist
    if (req.user.user_id.toString() !== customerId) {
      throw new ApiError(403, "Not authorized to modify this wishlist")
    }

    const { product_id } = req.body

    if (!product_id) {
      throw new ApiError(400, "Product ID is required")
    }

    const result = await Customer.addToWishlist(customerId, product_id)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

// Remove product from wishlist
router.delete("/:id/wishlist/:productId", isAuthenticated, async (req, res, next) => {
  try {
    const customerId = req.params.id
    const productId = req.params.productId

    // Check if user is authorized to modify this wishlist
    if (req.user.user_id.toString() !== customerId) {
      throw new ApiError(403, "Not authorized to modify this wishlist")
    }

    const result = await Customer.removeFromWishlist(customerId, productId)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Update customer profile (Customer only)
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const customerId = req.params.id

    // Check if user is authorized to update this profile
    if (req.user.user_type !== "Admin" && req.user.user_id.toString() !== customerId) {
      throw new ApiError(403, "Not authorized to update this profile")
    }

    // Update customer
    await Customer.update(customerId, req.body)

    // Get updated customer
    const updatedCustomer = await Customer.findById(customerId)

    res.json({
      message: "Customer profile updated successfully",
      customer: updatedCustomer,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
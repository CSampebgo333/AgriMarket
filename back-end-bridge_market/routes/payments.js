const express = require("express")
const router = express.Router()
const Payment = require("../models/payment")
const { isAuthenticated, hasRole } = require("../middleware/auth")
const { body, validationResult } = require("express-validator")

// Get all payments (Admin only)
router.get("/", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const payments = await Payment.getAll()
    res.json(payments)
  } catch (error) {
    console.error("Get payments error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get payments for current user
router.get("/my-payments", isAuthenticated, async (req, res) => {
  try {
    const payments = await Payment.getByUserId(req.user.user_id)
    res.json(payments)
  } catch (error) {
    console.error("Get user payments error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get payment by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const payment = await Payment.getById(req.params.id)

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    // Check if user is authorized to view this payment
    if (payment.user_id !== req.user.user_id && req.user.user_type !== "Admin") {
      return res.status(403).json({ error: "Not authorized to view this payment" })
    }

    res.json(payment)
  } catch (error) {
    console.error("Get payment error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get payments by order ID
router.get("/order/:orderId", isAuthenticated, async (req, res) => {
  try {
    const payment = await Payment.findByOrderId(req.params.orderId)

    if (!payment) {
      return res.status(404).json({ error: "Payment not found for this order" })
    }

    // Check if user is authorized to view this payment
    if (req.user.userType !== "Admin" && req.user.id !== payment.customer_id) {
      return res.status(403).json({ error: "Not authorized to view this payment" })
    }

    res.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    res.status(500).json({ error: "Failed to fetch payment" })
  }
})

// Get payments by customer ID
router.get("/customer/:customerId", isAuthenticated, async (req, res) => {
  try {
    const customerId = req.params.customerId

    // Check if user is authorized to view these payments
    if (req.user.userType !== "Admin" && req.user.id !== Number.parseInt(customerId)) {
      return res.status(403).json({ error: "Not authorized to view these payments" })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const payments = await Payment.findByCustomerId(customerId, page, limit)
    res.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    res.status(500).json({ error: "Failed to fetch payments" })
  }
})

// Create a new payment
router.post("/", [
  isAuthenticated,
  body("order_id").isInt().withMessage("Valid order ID is required"),
  body("amount").isFloat({ min: 0 }).withMessage("Valid amount is required"),
  body("payment_method").notEmpty().withMessage("Payment method is required")
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const paymentId = await Payment.create({
      ...req.body,
      user_id: req.user.user_id
    })

    res.status(201).json({
      message: "Payment created successfully",
      paymentId
    })
  } catch (error) {
    console.error("Create payment error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update payment status (Admin only)
router.patch("/:id/status", [
  isAuthenticated,
  hasRole(["Admin"]),
  body("status").isIn(["pending", "completed", "failed", "refunded"])
    .withMessage("Invalid status")
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const payment = await Payment.getById(req.params.id)

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    await Payment.updateStatus(req.params.id, req.body.status)

    res.json({
      message: "Payment status updated successfully"
    })
  } catch (error) {
    console.error("Update payment status error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update payment (admin only)
router.put("/:id", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const { status, method } = req.body

    const payment = await Payment.update(req.params.id, { status, method })

    res.json(payment)
  } catch (error) {
    console.error("Error updating payment:", error)
    res.status(500).json({ error: "Failed to update payment" })
  }
})

// Delete payment (Admin only)
router.delete('/:id', [
  isAuthenticated,
  hasRole(['Admin'])
], async (req, res) => {
  try {
    const payment = await Payment.getById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    await Payment.delete(req.params.id);
    
    res.json({
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router
const express = require("express")
const router = express.Router()
const { Delivery, Logistician } = require("../models")
const { isAuthenticated, hasRole } = require("../middleware/auth")
const { body, validationResult } = require('express-validator')

// Get all deliveries (Admin only)
router.get("/", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const deliveries = await Delivery.getAll()
    res.json(deliveries)
  } catch (error) {
    console.error("Get deliveries error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get deliveries for current user
router.get("/my-deliveries", isAuthenticated, async (req, res) => {
  try {
    const deliveries = await Delivery.getByUserId(req.user.user_id)
    res.json(deliveries)
  } catch (error) {
    console.error("Get user deliveries error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get delivery by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const delivery = await Delivery.getById(req.params.id)
    
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" })
    }
    
    // Check if user is authorized to view this delivery
    if (delivery.user_id !== req.user.user_id && req.user.user_type !== "Admin") {
      return res.status(403).json({ error: "Not authorized to view this delivery" })
    }
    
    res.json(delivery)
  } catch (error) {
    console.error("Get delivery error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get delivery by order ID
router.get("/order/:orderId", isAuthenticated, async (req, res) => {
  try {
    const delivery = await Delivery.findByOrderId(req.params.orderId)

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found for this order" })
    }

    // Check if user is authorized to view this delivery
    if (
      req.user.userType !== "Admin" &&
      req.user.id !== delivery.customer_id &&
      req.user.id !== delivery.logistician_id
    ) {
      return res.status(403).json({ error: "Not authorized to view this delivery" })
    }

    res.json(delivery)
  } catch (error) {
    console.error("Error fetching delivery:", error)
    res.status(500).json({ error: "Failed to fetch delivery" })
  }
})

// Get deliveries by customer ID
router.get("/customer/:customerId", isAuthenticated, async (req, res) => {
  try {
    const customerId = req.params.customerId

    // Check if user is authorized to view these deliveries
    if (req.user.userType !== "Admin" && req.user.id !== Number.parseInt(customerId)) {
      return res.status(403).json({ error: "Not authorized to view these deliveries" })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const deliveries = await Delivery.findByCustomerId(customerId, page, limit)
    res.json(deliveries)
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    res.status(500).json({ error: "Failed to fetch deliveries" })
  }
})

// Get deliveries by logistician ID
router.get("/logistician/:logisticianId", isAuthenticated, async (req, res) => {
  try {
    const logisticianId = req.params.logisticianId

    // Check if user is authorized to view these deliveries
    if (req.user.userType !== "Admin" && req.user.id !== Number.parseInt(logisticianId)) {
      return res.status(403).json({ error: "Not authorized to view these deliveries" })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status

    const deliveries = await Delivery.findByLogisticianId(logisticianId, page, limit)
    res.json(deliveries)
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    res.status(500).json({ error: "Failed to fetch deliveries" })
  }
})

// Create a new delivery
router.post("/", [
  isAuthenticated,
  hasRole(["Logistician"]),
  body("order_id").isInt().withMessage("Valid order ID is required"),
  body("status").isIn(["pending", "in_transit", "delivered", "failed"])
    .withMessage("Invalid status"),
  body("estimated_delivery_date").isISO8601().withMessage("Valid date is required")
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const deliveryId = await Delivery.create({
      ...req.body,
      user_id: req.user.user_id
    })
    
    res.status(201).json({
      message: "Delivery created successfully",
      deliveryId
    })
  } catch (error) {
    console.error("Create delivery error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Assign logistician to delivery
router.patch("/:id/assign", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const { logistician_id } = req.body

    if (!logistician_id) {
      return res.status(400).json({ error: "Logistician ID is required" })
    }

    // Check if logistician exists and is available
    const logistician = await Logistician.findById(logistician_id)

    if (!logistician) {
      return res.status(404).json({ error: "Logistician not found" })
    }

    if (!logistician.availability_status) {
      return res.status(400).json({ error: "Logistician is not available" })
    }

    const delivery = await Delivery.assignLogistician(req.params.id, logistician_id)

    res.json(delivery)
  } catch (error) {
    console.error("Error assigning logistician:", error)
    res.status(500).json({ error: "Failed to assign logistician" })
  }
})

// Update delivery status
router.patch("/:id/status", [
  isAuthenticated,
  hasRole(["Logistician", "Admin"]),
  body("status").isIn(["pending", "in_transit", "delivered", "failed"])
    .withMessage("Invalid status")
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const delivery = await Delivery.getById(req.params.id)
    
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" })
    }
    
    // Check if user is authorized to update this delivery
    if (delivery.user_id !== req.user.user_id && req.user.user_type !== "Admin") {
      return res.status(403).json({ error: "Not authorized to update this delivery" })
    }
    
    await Delivery.updateStatus(req.params.id, req.body.status)
    
    res.json({
      message: "Delivery status updated successfully"
    })
  } catch (error) {
    console.error("Update delivery status error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update delivery
router.put("/:id", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const {
      logistician_id,
      delivery_date,
      estimated_delivery_date,
      delivery_cost,
      delivery_status,
      tracking_number,
      delivery_notes,
    } = req.body

    const delivery = await Delivery.update(req.params.id, {
      logistician_id,
      delivery_date,
      estimated_delivery_date,
      delivery_cost,
      delivery_status,
      tracking_number,
      delivery_notes,
    })

    res.json(delivery)
  } catch (error) {
    console.error("Error updating delivery:", error)
    res.status(500).json({ error: "Failed to update delivery" })
  }
})

// Delete delivery (Admin only)
router.delete("/:id", [
  isAuthenticated,
  hasRole(["Admin"])
], async (req, res) => {
  try {
    const delivery = await Delivery.getById(req.params.id)
    
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" })
    }
    
    await Delivery.delete(req.params.id)
    
    res.json({
      message: "Delivery deleted successfully"
    })
  } catch (error) {
    console.error("Delete delivery error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
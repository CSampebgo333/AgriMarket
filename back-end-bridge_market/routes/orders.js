const express = require("express")
const router = express.Router()
const db = require("../lib/db")
const { isAuthenticated } = require("../middleware/auth")

// Get all orders for the authenticated user
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.user_id
    const userType = req.user.user_type

    let query
    let params

    // Different queries based on user type
    if (userType === "Seller") {
      // Sellers see orders for their products
      query = `
        SELECT o.*, u.user_name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.customer_id = u.user_id
        WHERE o.seller_id = ?
        ORDER BY o.order_date DESC
      `
      params = [userId]
    } else if (userType === "Customer") {
      // Customers see their own orders
      query = `
        SELECT o.*, u.user_name as seller_name, u.email as seller_email
        FROM orders o
        JOIN users u ON o.seller_id = u.user_id
        WHERE o.customer_id = ?
        ORDER BY o.order_date DESC
      `
      params = [userId]
    } else if (userType === "Admin") {
      // Admins see all orders
      query = `
        SELECT o.*, 
               c.user_name as customer_name, c.email as customer_email,
               s.user_name as seller_name, s.email as seller_email
        FROM orders o
        JOIN users c ON o.customer_id = c.user_id
        JOIN users s ON o.seller_id = s.user_id
        ORDER BY o.order_date DESC
      `
      params = []
    } else {
      return res.status(403).json({ error: "Unauthorized access" })
    }

    const orders = await db.query(query, params)

    // Get order items for each order
    for (const order of orders) {
      const items = await db.query(
        `
        SELECT oi.*, p.name as product_name, p.price as product_price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `,
        [order.order_id],
      )

      order.items = items
    }

    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    next(error)
  }
})

// Get a specific order by ID
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.id
    const userId = req.user.user_id
    const userType = req.user.user_type

    // Build query based on user type
    let query
    let params

    if (userType === "Admin") {
      // Admins can see any order
      query = `
        SELECT o.*, 
               c.user_name as customer_name, c.email as customer_email,
               s.user_name as seller_name, s.email as seller_email
        FROM orders o
        JOIN users c ON o.customer_id = c.user_id
        JOIN users s ON o.seller_id = s.user_id
        WHERE o.order_id = ?
      `
      params = [orderId]
    } else if (userType === "Seller") {
      // Sellers can only see their own orders
      query = `
        SELECT o.*, u.user_name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.customer_id = u.user_id
        WHERE o.order_id = ? AND o.seller_id = ?
      `
      params = [orderId, userId]
    } else {
      // Customers can only see their own orders
      query = `
        SELECT o.*, u.user_name as seller_name, u.email as seller_email
        FROM orders o
        JOIN users u ON o.seller_id = u.user_id
        WHERE o.order_id = ? AND o.customer_id = ?
      `
      params = [orderId, userId]
    }

    const order = await db.getOne(query, params)

    if (!order) {
      return res.status(404).json({ error: "Order not found or access denied" })
    }

    // Get order items
    const items = await db.query(
      `
      SELECT oi.*, p.name as product_name, p.price as product_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `,
      [orderId],
    )

    order.items = items

    res.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    next(error)
  }
})

// Create a new order
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    // Check if user is a customer
    if (req.user.user_type !== "Customer") {
      return res.status(403).json({ error: "Only customers can create orders" })
    }

    const { seller_id, items, shipping_address, payment_method } = req.body

    if (!seller_id || !items || !items.length || !shipping_address || !payment_method) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Start a transaction
    const connection = await db.beginTransaction()

    try {
      // Calculate total amount
      let totalAmount = 0
      for (const item of items) {
        const product = await db.getOne("SELECT price FROM products WHERE product_id = ?", [item.product_id])
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`)
        }
        totalAmount += product.price * item.quantity
      }

      // Create order
      const orderId = await db.insert("orders", {
        customer_id: req.user.user_id,
        seller_id,
        order_date: new Date(),
        total_amount: totalAmount,
        status: "pending",
        shipping_address,
        payment_method,
      })

      // Create order items
      for (const item of items) {
        await db.insert("order_items", {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })

        // Update product stock
        await db.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?", [
          item.quantity,
          item.product_id,
        ])
      }

      // Commit the transaction
      await db.commitTransaction(connection)

      res.status(201).json({
        message: "Order created successfully",
        order_id: orderId,
      })
    } catch (error) {
      // Rollback the transaction in case of error
      await db.rollbackTransaction(connection)
      throw error
    }
  } catch (error) {
    console.error("Error creating order:", error)
    next(error)
  }
})

// Update order status
router.put("/:id/status", isAuthenticated, async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { status } = req.body
    const userId = req.user.user_id
    const userType = req.user.user_type

    if (!status) {
      return res.status(400).json({ error: "Status is required" })
    }

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    // Check if the user has permission to update this order
    let order
    if (userType === "Seller") {
      order = await db.getOne("SELECT * FROM orders WHERE order_id = ? AND seller_id = ?", [orderId, userId])
    } else if (userType === "Admin") {
      order = await db.getOne("SELECT * FROM orders WHERE order_id = ?", [orderId])
    } else {
      return res.status(403).json({ error: "Not authorized to update order status" })
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found or access denied" })
    }

    // Update order status
    await db.update("orders", { status }, { order_id: orderId })

    res.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Error updating order status:", error)
    next(error)
  }
})

module.exports = router
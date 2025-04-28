const db = require("../lib/db")

class Payment {
  static async findAll() {
    return db.query("SELECT * FROM Payment")
  }

  static async findById(paymentId) {
    const [payment] = await db.query("SELECT * FROM Payment WHERE payment_id = ?", [paymentId])
    return payment[0]
  }

  static async findByOrderId(orderId) {
    const [payment] = await db.query("SELECT * FROM Payment WHERE order_id = ?", [orderId])
    return payment[0]
  }

  static async findByCustomerId(customerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit
    const [payments] = await db.query(
      "SELECT * FROM Payment WHERE customer_id = ? ORDER BY transaction_date DESC LIMIT ? OFFSET ?",
      [customerId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Payment WHERE customer_id = ?", [customerId])

    return {
      payments,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async create(paymentData) {
    const { order_id, customer_id, amount, method, status = "pending" } = paymentData

    const [result] = await db.query(
      "INSERT INTO Payment (order_id, customer_id, amount, method, status) VALUES (?, ?, ?, ?, ?)",
      [order_id, customer_id, amount, method, status],
    )

    return this.findById(result.insertId)
  }

  static async update(paymentId, paymentData) {
    const { status, method } = paymentData

    await db.query("UPDATE Payment SET status = ?, method = ? WHERE payment_id = ?", [status, method, paymentId])

    return this.findById(paymentId)
  }

  static async delete(paymentId) {
    await db.query("DELETE FROM Payment WHERE payment_id = ?", [paymentId])
    return { paymentId }
  }
}

module.exports = Payment
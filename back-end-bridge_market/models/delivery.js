const db = require("../lib/db")

class Delivery {
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [deliveries] = await db.query(
      `SELECT d.*, 
        u1.user_name as logistician_name, 
        u2.user_name as customer_name,
        o.status as order_status
      FROM Delivery d
      LEFT JOIN User u1 ON d.logistician_id = u1.user_id
      JOIN User u2 ON d.customer_id = u2.user_id
      JOIN \`Order\` o ON d.order_id = o.order_id
      ORDER BY d.estimated_delivery_date DESC
      LIMIT ? OFFSET ?`,
      [limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Delivery")

    return {
      deliveries,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async findById(deliveryId) {
    const [delivery] = await db.query(
      `SELECT d.*, 
        u1.user_name as logistician_name, 
        u2.user_name as customer_name,
        o.status as order_status
      FROM Delivery d
      LEFT JOIN User u1 ON d.logistician_id = u1.user_id
      JOIN User u2 ON d.customer_id = u2.user_id
      JOIN \`Order\` o ON d.order_id = o.order_id
      WHERE d.delivery_id = ?`,
      [deliveryId],
    )

    return delivery[0]
  }

  static async findByOrderId(orderId) {
    const [delivery] = await db.query(
      `SELECT d.*, 
        u1.user_name as logistician_name, 
        u2.user_name as customer_name
      FROM Delivery d
      LEFT JOIN User u1 ON d.logistician_id = u1.user_id
      JOIN User u2 ON d.customer_id = u2.user_id
      WHERE d.order_id = ?`,
      [orderId],
    )

    return delivery[0]
  }

  static async findByCustomerId(customerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [deliveries] = await db.query(
      `SELECT d.*, 
        u1.user_name as logistician_name, 
        o.status as order_status,
        o.order_date
      FROM Delivery d
      LEFT JOIN User u1 ON d.logistician_id = u1.user_id
      JOIN \`Order\` o ON d.order_id = o.order_id
      WHERE d.customer_id = ?
      ORDER BY d.estimated_delivery_date DESC
      LIMIT ? OFFSET ?`,
      [customerId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Delivery WHERE customer_id = ?", [customerId])

    return {
      deliveries,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async findByLogisticianId(logisticianId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [deliveries] = await db.query(
      `SELECT d.*, 
        u2.user_name as customer_name,
        o.status as order_status,
        o.order_date
      FROM Delivery d
      JOIN User u2 ON d.customer_id = u2.user_id
      JOIN \`Order\` o ON d.order_id = o.order_id
      WHERE d.logistician_id = ?
      ORDER BY d.delivery_status ASC, d.estimated_delivery_date ASC
      LIMIT ? OFFSET ?`,
      [logisticianId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Delivery WHERE logistician_id = ?", [
      logisticianId,
    ])

    return {
      deliveries,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async create(deliveryData) {
    const {
      order_id,
      logistician_id,
      customer_id,
      estimated_delivery_date,
      delivery_cost,
      tracking_number,
      delivery_notes,
    } = deliveryData

    const [result] = await db.query(
      `INSERT INTO Delivery 
        (order_id, logistician_id, customer_id, estimated_delivery_date, 
         delivery_cost, tracking_number, delivery_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        logistician_id || null,
        customer_id,
        estimated_delivery_date,
        delivery_cost,
        tracking_number,
        delivery_notes,
      ],
    )

    return this.findById(result.insertId)
  }

  static async update(deliveryId, deliveryData) {
    const {
      logistician_id,
      delivery_date,
      estimated_delivery_date,
      delivery_cost,
      delivery_status,
      tracking_number,
      delivery_notes,
    } = deliveryData

    await db.query(
      `UPDATE Delivery SET
        logistician_id = ?,
        delivery_date = ?,
        estimated_delivery_date = ?,
        delivery_cost = ?,
        delivery_status = ?,
        tracking_number = ?,
        delivery_notes = ?
      WHERE delivery_id = ?`,
      [
        logistician_id,
        delivery_date,
        estimated_delivery_date,
        delivery_cost,
        delivery_status,
        tracking_number,
        delivery_notes,
        deliveryId,
      ],
    )

    return this.findById(deliveryId)
  }

  static async assignLogistician(deliveryId, logisticianId) {
    await db.query('UPDATE Delivery SET logistician_id = ?, delivery_status = "processing" WHERE delivery_id = ?', [
      logisticianId,
      deliveryId,
    ])

    return this.findById(deliveryId)
  }

  static async updateStatus(deliveryId, status) {
    await db.query("UPDATE Delivery SET delivery_status = ? WHERE delivery_id = ?", [status, deliveryId])

    // If status is delivered, update delivery_date
    if (status === "delivered") {
      await db.query("UPDATE Delivery SET delivery_date = CURRENT_DATE() WHERE delivery_id = ?", [deliveryId])

      // Also update the order status
      const [delivery] = await db.query("SELECT order_id FROM Delivery WHERE delivery_id = ?", [deliveryId])

      if (delivery[0]) {
        await db.query('UPDATE `Order` SET status = "delivered" WHERE order_id = ?', [delivery[0].order_id])
      }
    }

    return this.findById(deliveryId)
  }
}

module.exports = Delivery
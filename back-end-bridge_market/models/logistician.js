const db = require("../lib/db")

class Logistician {
  static async findAll() {
    const [logisticians] = await db.query(
      `SELECT u.*, l.*
       FROM User u
       JOIN Logistician l ON u.user_id = l.user_id
       WHERE u.user_type = 'Logistician'`,
    )
    return logisticians
  }

  static async findById(userId) {
    const [logistician] = await db.query(
      `SELECT u.*, l.*
       FROM User u
       JOIN Logistician l ON u.user_id = l.user_id
       WHERE u.user_id = ? AND u.user_type = 'Logistician'`,
      [userId],
    )
    return logistician[0]
  }

  static async findAvailable(location = null) {
    let query = `
      SELECT u.*, l.*
      FROM User u
      JOIN Logistician l ON u.user_id = l.user_id
      WHERE u.user_type = 'Logistician' AND l.availability_status = TRUE
    `

    const params = []

    if (location) {
      query += " AND l.location = ?"
      params.push(location)
    }

    const [logisticians] = await db.query(query, params)
    return logisticians
  }

  static async create(userData, logisticianData) {
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // Create user first
      const [userResult] = await connection.query(
        `INSERT INTO User (user_name, email, phone_number, country, user_type)
         VALUES (?, ?, ?, ?, 'Logistician')`,
        [userData.user_name, userData.email, userData.phone_number, userData.country],
      )

      const userId = userResult.insertId

      // Create logistician record
      await connection.query(
        `INSERT INTO Logistician (user_id, availability_status, location, rating, transport_type, capacity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          logisticianData.availability_status !== undefined ? logisticianData.availability_status : true,
          logisticianData.location,
          logisticianData.rating || null,
          logisticianData.transport_type,
          logisticianData.capacity,
        ],
      )

      await connection.commit()

      return this.findById(userId)
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  static async update(userId, userData, logisticianData) {
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // Update user data
      await connection.query(
        `UPDATE User SET
         user_name = ?,
         phone_number = ?,
         country = ?
         WHERE user_id = ?`,
        [userData.user_name, userData.phone_number, userData.country, userId],
      )

      // Update logistician data
      await connection.query(
        `UPDATE Logistician SET
         availability_status = ?,
         location = ?,
         transport_type = ?,
         capacity = ?
         WHERE user_id = ?`,
        [
          logisticianData.availability_status,
          logisticianData.location,
          logisticianData.transport_type,
          logisticianData.capacity,
          userId,
        ],
      )

      await connection.commit()

      return this.findById(userId)
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  static async updateRating(userId, rating) {
    await db.query("UPDATE Logistician SET rating = ? WHERE user_id = ?", [rating, userId])

    return this.findById(userId)
  }

  static async updateAvailability(userId, availabilityStatus) {
    await db.query("UPDATE Logistician SET availability_status = ? WHERE user_id = ?", [availabilityStatus, userId])

    return this.findById(userId)
  }

  static async getDeliveries(logisticianId, status = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    let query = `
      SELECT d.*, 
        o.status as order_status,
        o.order_date,
        u.user_name as customer_name,
        u.phone_number as customer_phone
      FROM Delivery d
      JOIN \`Order\` o ON d.order_id = o.order_id
      JOIN User u ON d.customer_id = u.user_id
      WHERE d.logistician_id = ?
    `

    const params = [logisticianId]

    if (status) {
      query += " AND d.delivery_status = ?"
      params.push(status)
    }

    query += " ORDER BY d.estimated_delivery_date ASC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const [deliveries] = await db.query(query, params)

    let countQuery = `
      SELECT COUNT(*) as total
      FROM Delivery
      WHERE logistician_id = ?
    `

    const countParams = [logisticianId]

    if (status) {
      countQuery += " AND delivery_status = ?"
      countParams.push(status)
    }

    const [countResult] = await db.query(countQuery, countParams)

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
}

module.exports = Logistician
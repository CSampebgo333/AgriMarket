const db = require("../lib/db")

class Administrator {
  static async findAll() {
    const [admins] = await db.query(
      `SELECT u.*, a.*
       FROM User u
       JOIN Administrator a ON u.user_id = a.user_id
       WHERE u.user_type = 'Admin'`,
    )
    return admins
  }

  static async findById(userId) {
    const [admin] = await db.query(
      `SELECT u.*, a.*
       FROM User u
       JOIN Administrator a ON u.user_id = a.user_id
       WHERE u.user_id = ? AND u.user_type = 'Admin'`,
      [userId],
    )
    return admin[0]
  }

  static async create(userData, adminData) {
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // Create user first
      const [userResult] = await connection.query(
        `INSERT INTO User (user_name, email, phone_number, country, user_type)
         VALUES (?, ?, ?, ?, 'Admin')`,
        [userData.user_name, userData.email, userData.phone_number, userData.country],
      )

      const userId = userResult.insertId

      // Create admin record
      await connection.query(
        `INSERT INTO Administrator (user_id, admin_level, permissions)
         VALUES (?, ?, ?)`,
        [userId, adminData.admin_level, JSON.stringify(adminData.permissions)],
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

  static async update(userId, userData, adminData) {
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

      // Update admin data
      await connection.query(
        `UPDATE Administrator SET
         admin_level = ?,
         permissions = ?
         WHERE user_id = ?`,
        [adminData.admin_level, JSON.stringify(adminData.permissions), userId],
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

  static async getDashboardStats() {
    // Get total users by type
    const [userStats] = await db.query(
      `SELECT user_type, COUNT(*) as count
       FROM User
       GROUP BY user_type`,
    )

    // Get total products
    const [productStats] = await db.query(
      `SELECT COUNT(*) as total_products,
        (SELECT COUNT(*) FROM Product WHERE stock_quantity = 0) as out_of_stock
       FROM Product`,
    )

    // Get order stats
    const [orderStats] = await db.query(
      `SELECT status, COUNT(*) as count
       FROM \`Order\`
       GROUP BY status`,
    )

    // Get recent orders
    const [recentOrders] = await db.query(
      `SELECT o.*, u.user_name as customer_name
       FROM \`Order\` o
       JOIN User u ON o.customer_id = u.user_id
       ORDER BY o.order_date DESC
       LIMIT 5`,
    )

    // Get top selling products
    const [topProducts] = await db.query(
      `SELECT p.product_id, p.name, p.price,
        (SELECT pi.image_url FROM ProductImage pi WHERE pi.product_id = p.product_id AND pi.is_primary = TRUE LIMIT 1) as image,
        SUM(od.quantity) as total_sold
       FROM Product p
       JOIN OrderDetail od ON p.product_id = od.product_id
       GROUP BY p.product_id
       ORDER BY total_sold DESC
       LIMIT 5`,
    )

    return {
      userStats,
      productStats: productStats[0],
      orderStats,
      recentOrders,
      topProducts,
    }
  }
}

module.exports = Administrator
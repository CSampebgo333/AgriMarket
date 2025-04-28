const db = require("../lib/db")

class Customer {
  static async findAll() {
    const [customers] = await db.query(
      `SELECT u.*, c.*
       FROM User u
       JOIN Customer c ON u.user_id = c.user_id
       WHERE u.user_type = 'Customer'`,
    )
    return customers
  }

  static async findById(userId) {
    const [customer] = await db.query(
      `SELECT u.*, c.*
       FROM User u
       JOIN Customer c ON u.user_id = c.user_id
       WHERE u.user_id = ? AND u.user_type = 'Customer'`,
      [userId],
    )
    return customer[0]
  }

  static async create(userData, customerData) {
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // Create user first
      const [userResult] = await connection.query(
        `INSERT INTO User (user_name, email, phone_number, country, user_type)
         VALUES (?, ?, ?, ?, 'Customer')`,
        [userData.user_name, userData.email, userData.phone_number, userData.country],
      )

      const userId = userResult.insertId

      // Create customer record
      await connection.query(
        `INSERT INTO Customer (user_id, address, location, preferred_payment_method)
         VALUES (?, ?, ?, ?)`,
        [userId, customerData.address, customerData.location, customerData.preferred_payment_method],
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

  static async update(userId, userData, customerData) {
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

      // Update customer data
      await connection.query(
        `UPDATE Customer SET
         address = ?,
         location = ?,
         preferred_payment_method = ?
         WHERE user_id = ?`,
        [customerData.address, customerData.location, customerData.preferred_payment_method, userId],
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

  static async getOrders(customerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [orders] = await db.query(
      `SELECT o.*, 
        p.status as payment_status,
        d.delivery_status,
        d.estimated_delivery_date,
        d.tracking_number
       FROM \`Order\` o
       LEFT JOIN Payment p ON o.order_id = p.order_id
       LEFT JOIN Delivery d ON o.order_id = d.order_id
       WHERE o.customer_id = ?
       ORDER BY o.order_date DESC
       LIMIT ? OFFSET ?`,
      [customerId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM `Order` WHERE customer_id = ?", [customerId])

    // Get order details for each order
    for (const order of orders) {
      const [orderDetails] = await db.query(
        `SELECT od.*, p.name as product_name, p.price as product_price, 
          (SELECT pi.image_url FROM ProductImage pi WHERE pi.product_id = p.product_id AND pi.is_primary = TRUE LIMIT 1) as product_image,
          c.name as category_name
         FROM OrderDetail od
         JOIN Product p ON od.product_id = p.product_id
         LEFT JOIN Category c ON p.category_id = c.category_id
         WHERE od.order_id = ?`,
        [order.order_id],
      )

      order.items = orderDetails
    }

    return {
      orders,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async getWishlist(customerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [wishlistItems] = await db.query(
      `SELECT w.*, p.*, 
        (SELECT pi.image_url FROM ProductImage pi WHERE pi.product_id = p.product_id AND pi.is_primary = TRUE LIMIT 1) as primary_image,
        c.name as category_name,
        u.user_name as seller_name,
        (SELECT AVG(r.rating) FROM Review r WHERE r.product_id = p.product_id) as avg_rating
       FROM WishlistItem w
       JOIN Product p ON w.product_id = p.product_id
       LEFT JOIN Category c ON p.category_id = c.category_id
       JOIN User u ON p.seller_id = u.user_id
       WHERE w.user_id = ?
       ORDER BY w.added_at DESC
       LIMIT ? OFFSET ?`,
      [customerId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM WishlistItem WHERE user_id = ?", [customerId])

    return {
      wishlistItems,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async addToWishlist(customerId, productId) {
    try {
      await db.query("INSERT INTO WishlistItem (user_id, product_id) VALUES (?, ?)", [customerId, productId])

      return { success: true, message: "Product added to wishlist" }
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return { success: false, message: "Product already in wishlist" }
      }
      throw error
    }
  }

  static async removeFromWishlist(customerId, productId) {
    await db.query("DELETE FROM WishlistItem WHERE user_id = ? AND product_id = ?", [customerId, productId])

    return { success: true, message: "Product removed from wishlist" }
  }
}

module.exports = Customer
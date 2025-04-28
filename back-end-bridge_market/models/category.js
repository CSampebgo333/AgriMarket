const db = require("../lib/db")

class Category {
  static async findAll() {
    const [categories] = await db.query("SELECT * FROM Category ORDER BY name")
    return categories
  }

  static async findById(categoryId) {
    const [category] = await db.query("SELECT * FROM Category WHERE category_id = ?", [categoryId])
    return category[0]
  }

  static async findByName(name) {
    const [category] = await db.query("SELECT * FROM Category WHERE name = ?", [name])
    return category[0]
  }

  static async create(categoryData) {
    const { name, description, image_path } = categoryData

    const [result] = await db.query("INSERT INTO Category (name, description, image_path) VALUES (?, ?, ?)", [
      name,
      description,
      image_path,
    ])

    return this.findById(result.insertId)
  }

  static async update(categoryId, categoryData) {
    const { name, description, image_path } = categoryData

    await db.query("UPDATE Category SET name = ?, description = ?, image_path = ? WHERE category_id = ?", [
      name,
      description,
      image_path,
      categoryId,
    ])

    return this.findById(categoryId)
  }

  static async delete(categoryId) {
    // Check if category is in use
    const [products] = await db.query("SELECT COUNT(*) as count FROM Product WHERE category_id = ?", [categoryId])

    if (products[0].count > 0) {
      throw new Error("Cannot delete category that is in use by products")
    }

    await db.query("DELETE FROM Category WHERE category_id = ?", [categoryId])
    return { categoryId }
  }

  static async getProducts(categoryId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [products] = await db.query(
      `SELECT p.*, 
        (SELECT pi.image_url FROM ProductImage pi WHERE pi.product_id = p.product_id AND pi.is_primary = TRUE LIMIT 1) as primary_image,
        u.user_name as seller_name,
        (SELECT AVG(r.rating) FROM Review r WHERE r.product_id = p.product_id) as avg_rating,
        (SELECT COUNT(*) FROM Review r WHERE r.product_id = p.product_id) as review_count
       FROM Product p
       JOIN User u ON p.seller_id = u.user_id
       WHERE p.category_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [categoryId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Product WHERE category_id = ?", [categoryId])

    return {
      products,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }
}

module.exports = Category
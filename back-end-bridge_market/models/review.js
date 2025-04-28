const db = require("../lib/db")

class Review {
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [reviews] = await db.query(
      `SELECT r.*, u.user_name, u.email, p.name as product_name
       FROM Review r
       JOIN User u ON r.user_id = u.user_id
       JOIN Product p ON r.product_id = p.product_id
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Review")

    return {
      reviews,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async findById(reviewId) {
    const [review] = await db.query(
      `SELECT r.*, u.user_name, u.email, p.name as product_name
       FROM Review r
       JOIN User u ON r.user_id = u.user_id
       JOIN Product p ON r.product_id = p.product_id
       WHERE r.review_id = ?`,
      [reviewId],
    )

    return review[0]
  }

  static async findByProductId(productId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [reviews] = await db.query(
      `SELECT r.*, u.user_name, u.email
       FROM Review r
       JOIN User u ON r.user_id = u.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [productId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Review WHERE product_id = ?", [productId])

    return {
      reviews,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async findByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [reviews] = await db.query(
      `SELECT r.*, p.name as product_name, 
        (SELECT pi.image_url FROM ProductImage pi WHERE pi.product_id = p.product_id AND pi.is_primary = TRUE LIMIT 1) as product_image
       FROM Review r
       JOIN Product p ON r.product_id = p.product_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    )

    const [countResult] = await db.query("SELECT COUNT(*) as total FROM Review WHERE user_id = ?", [userId])

    return {
      reviews,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    }
  }

  static async create(reviewData) {
    const { product_id, user_id, rating, title, content } = reviewData

    // Check if user has already reviewed this product
    const [existingReview] = await db.query("SELECT * FROM Review WHERE product_id = ? AND user_id = ?", [
      product_id,
      user_id,
    ])

    if (existingReview.length > 0) {
      throw new Error("You have already reviewed this product")
    }

    const [result] = await db.query(
      "INSERT INTO Review (product_id, user_id, rating, title, content) VALUES (?, ?, ?, ?, ?)",
      [product_id, user_id, rating, title, content],
    )

    // Update product rating
    await this.updateProductRating(product_id)

    return this.findById(result.insertId)
  }

  static async update(reviewId, reviewData) {
    const { rating, title, content } = reviewData

    const [review] = await db.query("SELECT product_id FROM Review WHERE review_id = ?", [reviewId])

    if (!review[0]) {
      throw new Error("Review not found")
    }

    await db.query("UPDATE Review SET rating = ?, title = ?, content = ? WHERE review_id = ?", [
      rating,
      title,
      content,
      reviewId,
    ])

    // Update product rating
    await this.updateProductRating(review[0].product_id)

    return this.findById(reviewId)
  }

  static async delete(reviewId) {
    const [review] = await db.query("SELECT product_id FROM Review WHERE review_id = ?", [reviewId])

    if (!review[0]) {
      throw new Error("Review not found")
    }

    await db.query("DELETE FROM Review WHERE review_id = ?", [reviewId])

    // Update product rating
    await this.updateProductRating(review[0].product_id)

    return { reviewId }
  }

  static async updateProductRating(productId) {
    // Calculate average rating
    const [ratingResult] = await db.query("SELECT AVG(rating) as avg_rating FROM Review WHERE product_id = ?", [
      productId,
    ])

    const avgRating = ratingResult[0].avg_rating || 0

    // Update product rating
    await db.query("UPDATE Product SET rating = ? WHERE product_id = ?", [avgRating, productId])

    return { productId, avgRating }
  }

  static async getProductRatingDistribution(productId) {
    const [distribution] = await db.query(
      `SELECT rating, COUNT(*) as count
       FROM Review
       WHERE product_id = ?
       GROUP BY rating
       ORDER BY rating DESC`,
      [productId],
    )

    return distribution
  }
}

module.exports = Review
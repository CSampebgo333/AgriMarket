const express = require("express")
const router = express.Router()
const { Category, Product } = require("../models")
const { isAuthenticated, hasRole } = require("../middleware/auth")
const db = require('../lib/db')

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories')
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.status(200).json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    res.status(500).json({ message: "Failed to fetch category", error: error.message })
  }
})

// Create new category (admin only)
router.post("/", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const { name, description } = req.body
    
    if (!name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const categoryId = await db.insert('categories', {
      name,
      description: description || null
    })

    res.status(201).json({
      message: "Category created successfully",
      categoryId
    })
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(500).json({ error: "Failed to create category" })
  }
})

// Update category (admin only)
router.put("/:id", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    await db.update('categories', 
      { name, description: description || null },
      { category_id: id }
    )

    res.json({ message: "Category updated successfully" })
  } catch (error) {
    console.error("Error updating category:", error)
    res.status(500).json({ error: "Failed to update category" })
  }
})

// Delete category (admin only)
router.delete("/:id", isAuthenticated, hasRole(["Admin"]), async (req, res) => {
  try {
    const { id } = req.params
    
    await db.remove('categories', { category_id: id })
    
    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

// Get products by category ID
router.get("/:id/products", async (req, res) => {
  try {
    const categoryId = req.params.id

    // Verify category exists
    const category = await Category.findByPk(categoryId)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Optional query parameters
    const limit = Number.parseInt(req.query.limit) || 10
    const offset = Number.parseInt(req.query.offset) || 0

    const products = await Product.findAndCountAll({
      where: {
        category_id: categoryId,
        status: "active",
      },
      limit,
      offset,
      order: [["name", "ASC"]],
    })

    res.status(200).json({
      total: products.count,
      products: products.rows,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching products by category:", error)
    res.status(500).json({ message: "Failed to fetch products", error: error.message })
  }
})

module.exports = router
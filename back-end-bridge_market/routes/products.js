const express = require("express")
const router = express.Router()
const Product = require("../models/product")
const { isAuthenticated } = require("../middleware/auth")

// Create a new product
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    // Log the request body to debug
    console.log("Request body:", req.body);
    
    const { 
      name, 
      description, 
      price, 
      category_id, 
      images,
      expiry_date,
      manufacture_date,
      weight,
      weight_unit,
      country_of_origin,
      stock_quantity,
      featured,
      discount
    } = req.body;

    const seller_id = req.user.user_id;
    
    if (!name || !description || !price || !category_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const productData = {
      seller_id,
      name,
      description,
      category_id,
      price,
      images,
      expiry_date,
      manufacture_date,
      weight,
      weight_unit,
      country_of_origin,
      stock_quantity: stock_quantity || 0,
      featured: featured === 'true',
      discount: discount || 0,
    };

    const productId = await Product.create(productData);
    res.status(201).json({
      message: "Product created successfully",
      product_id: productId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
});

// Get all products
router.get("/", async (req, res, next) => {
  try {
    const options = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      category_id: req.query.category_id,
      seller_id: req.query.seller_id,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      country_of_origin: req.query.country_of_origin,
      featured: req.query.featured === "true",
      search: req.query.search,
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order,
      exclude_id: req.query.exclude_id,
    }
    
    const result = await Product.getAll(options)
    res.json(result)
  } catch (error) {
    console.error("Error getting products:", error)
    next(error)
  }
})

// Get product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    console.error("Error getting product:", error)
    next(error)
  }
})

// Update product
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const productId = req.params.id
    const product = await Product.getById(productId)
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    
    if (product.seller_id !== req.user.user_id && req.user.user_type !== "Admin") {
      return res.status(403).json({ error: "Not authorized to update this product" })
    }
    
    // Log the request body and files
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    // Get existing image IDs to keep
    let existingImages = [];
    try {
      existingImages = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
    } catch (error) {
      console.error("Error parsing existing_images:", error);
      return res.status(400).json({ error: "Invalid existing_images format" });
    }
    
    // Get new images - extract just the filename from the path
    const newImages = req.files ? req.files.map(file => file.filename) : [];

    // Prepare product data
    const productData = {
      ...req.body,
      existing_images: existingImages,
      images: newImages
    };

    // Convert numeric fields
    if (productData.price) productData.price = parseFloat(productData.price);
    if (productData.stock_quantity) productData.stock_quantity = parseInt(productData.stock_quantity);
    if (productData.category_id) productData.category_id = parseInt(productData.category_id);
    if (productData.weight) productData.weight = parseFloat(productData.weight);
    if (productData.discount) productData.discount = parseFloat(productData.discount);

    console.log("Processed product data:", productData);

    await Product.update(productId, productData)
    res.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    next(error)
  }
})

// Delete product
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const productId = req.params.id
    const product = await Product.getById(productId)
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    
    if (product.seller_id !== req.user.user_id && req.user.user_type !== "Admin") {
      return res.status(403).json({ error: "Not authorized to delete this product" })
    }

    await Product.delete(productId)
    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    next(error)
  }
})

// Get related products
router.get("/:id/related", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 4
    const relatedProducts = await Product.getRelated(req.params.id, limit)
    res.json(relatedProducts)
  } catch (error) {
    console.error("Error getting related products:", error)
    next(error)
  }
})

// Add a review to a product
router.post("/:id/reviews", isAuthenticated, async (req, res, next) => {
  try {
    const productId = req.params.id
    const product = await Product.getById(productId)
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    
    if (product.seller_id === req.user.user_id) {
      return res.status(400).json({ error: "You cannot review your own product" })
    }

    const reviewData = {
      product_id: productId,
      user_id: req.user.user_id,
      rating: req.body.rating,
      title: req.body.title,
      content: req.body.content,
    }
    
    const reviewId = await Product.addReview(reviewData)
    res.status(201).json({
      message: "Review added successfully",
      review_id: reviewId,
    })
  } catch (error) {
    console.error("Error adding review:", error)
    next(error)
  }
})

// Get reviews for a product
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const result = await Product.getReviews(req.params.id, page, limit)
    res.json(result)
  } catch (error) {
    console.error("Error getting reviews:", error)
    next(error)
  }
})

module.exports = router
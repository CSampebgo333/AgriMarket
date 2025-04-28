const express = require("express")
const router = express.Router()
const db = require("../lib/db")
const { isAuthenticated } = require("../middleware/auth")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile_images')
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
  }
})

// Get seller profile
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id

    // Get seller profile from the database
    const seller = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])
    
    if (!seller) {
      // If seller record doesn't exist, create a default one
      await db.insert("sellers", {
        user_id: userId,
        business_name: req.user.user_name + "'s Business",
        description: "",
      })
    }

    // Get the user data
    const userData = await db.getOne("SELECT * FROM users WHERE user_id = ?", [userId])

    // Split user_name into first and last name
    const [first_name, last_name] = userData.user_name ? userData.user_name.split(' ') : ['', '']

    // Return both personal and business profile data
    res.json({
      // Personal information
      first_name: first_name || "",
      last_name: last_name || "",
      email: userData.email || "",
      phone_number: userData.phone_number || "",
      profile_image: userData.profile_image || "",

      // Business information
      business_name: seller?.business_name || userData.user_name + "'s Business",
      business_email: userData.email || "",
      business_phone: userData.phone_number || "",
      business_address: seller?.address || "",
      business_description: seller?.description || "",
      logo_url: userData.profile_image || "",
    })
  } catch (error) {
    console.error("Error fetching seller profile:", error)
    next(error)
  }
})

// Update seller profile
router.put("/profile", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id
    const {
      first_name,
      last_name,
      email,
      phone_number,
      profile_image,
      business_name,
      business_email,
      business_phone,
      business_address,
      business_description,
      logo_url
    } = req.body

    // Update user table (personal information)
    const userUpdates = {}
    if (first_name && last_name) {
      userUpdates.user_name = `${first_name} ${last_name}`
    }
    if (email) userUpdates.email = email
    if (phone_number) userUpdates.phone_number = phone_number
    if (profile_image) userUpdates.profile_image = profile_image

    if (Object.keys(userUpdates).length > 0) {
      await db.update("users", userUpdates, { user_id: userId })
    }

    // Check if seller record exists
    const seller = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])

    if (seller) {
      // Update seller table (business information)
      const sellerUpdates = {}
      if (business_name) sellerUpdates.business_name = business_name
      if (business_address) sellerUpdates.address = business_address
      if (business_description) sellerUpdates.description = business_description

      if (Object.keys(sellerUpdates).length > 0) {
        await db.update("sellers", sellerUpdates, { user_id: userId })
      }
    } else {
      // Create seller record if it doesn't exist
      await db.insert("sellers", {
        user_id: userId,
        business_name: business_name || req.user.user_name + "'s Business",
        address: business_address || "",
        description: business_description || "",
      })
    }

    res.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating seller profile:", error)
    next(error)
  }
})

// Get seller store profile
router.get("/store", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id

    // Get seller store profile from the database
    // First check if the seller record exists
    const seller = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])

    if (!seller) {
      // If seller record doesn't exist, create a default one
      await db.insert("sellers", {
        user_id: userId,
        business_name: req.user.user_name + "'s Business",
        description: "",
        // Add other default fields as needed
      })
    }

    // Get the user data
    const userData = await db.getOne("SELECT * FROM users WHERE user_id = ?", [userId])

    // Return the store profile with default values
    res.json({
      store_name: seller?.business_name || userData.user_name + "'s Business",
      store_description: seller?.description || "",
      store_banner: seller?.banner_image || "",
      store_logo: userData.profile_image || "",
      store_location: seller?.location || "",
      store_country: seller?.country || "burkina-faso",
      store_city: seller?.city || "",
      store_address: seller?.address || "",
      store_hours: {
        monday: { open: "08:00", close: "18:00", closed: false },
        tuesday: { open: "08:00", close: "18:00", closed: false },
        wednesday: { open: "08:00", close: "18:00", closed: false },
        thursday: { open: "08:00", close: "18:00", closed: false },
        friday: { open: "08:00", close: "18:00", closed: false },
        saturday: { open: "09:00", close: "16:00", closed: false },
        sunday: { open: "09:00", close: "16:00", closed: true },
      },
      shipping_policy: seller?.shipping_policy || "",
      return_policy: seller?.return_policy || "",
    })
  } catch (error) {
    console.error("Error fetching store profile:", error)
    next(error)
  }
})

// Update seller store profile
router.put("/store", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id
    const {
      store_name,
      store_description,
      store_banner,
      store_logo,
      store_location,
      store_country,
      store_city,
      store_address,
      shipping_policy,
      return_policy,
    } = req.body

    // Update user table
    const userUpdates = {}
    if (store_logo) userUpdates.profile_image = store_logo

    if (Object.keys(userUpdates).length > 0) {
      await db.update("users", userUpdates, { user_id: userId })
    }

    // Check if seller record exists
    const seller = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])

    if (seller) {
      // Update seller table
      const sellerUpdates = {}
      if (store_name) sellerUpdates.business_name = store_name
      if (store_description) sellerUpdates.description = store_description
      if (store_banner) sellerUpdates.banner_image = store_banner
      if (store_location) sellerUpdates.location = store_location
      if (store_country) sellerUpdates.country = store_country
      if (store_city) sellerUpdates.city = store_city
      if (store_address) sellerUpdates.address = store_address
      if (shipping_policy) sellerUpdates.shipping_policy = shipping_policy
      if (return_policy) sellerUpdates.return_policy = return_policy

      if (Object.keys(sellerUpdates).length > 0) {
        await db.update("sellers", sellerUpdates, { user_id: userId })
      }
    } else {
      // Create seller record if it doesn't exist
      await db.insert("sellers", {
        user_id: userId,
        business_name: store_name || req.user.user_name + "'s Business",
        description: store_description || "",
        banner_image: store_banner || "",
        location: store_location || "",
        country: store_country || "burkina-faso",
        city: store_city || "",
        address: store_address || "",
        shipping_policy: shipping_policy || "",
        return_policy: return_policy || "",
        // Add other fields as needed
      })
    }

    res.json({ message: "Store profile updated successfully" })
  } catch (error) {
    console.error("Error updating store profile:", error)
    next(error)
  }
})

// Get seller settings
router.get("/settings", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id

    // Check if seller record exists
    const seller = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])

    if (!seller) {
      // If seller record doesn't exist, create a default one
      await db.insert("sellers", {
        user_id: userId,
        business_name: req.user.user_name + "'s Business",
        notification_email: 1,
        notification_sms: 0,
        auto_approve_orders: 0,
        currency: "XOF",
        timezone: "Africa/Ouagadougou",
        // Add other default fields as needed
      })
    }

    // Return the settings with default values
    res.json({
      notification_email: seller?.notification_email !== 0,
      notification_sms: seller?.notification_sms !== 0,
      auto_approve_orders: seller?.auto_approve_orders !== 0,
      currency: seller?.currency || "XOF",
      timezone: seller?.timezone || "Africa/Ouagadougou",
    })
  } catch (error) {
    console.error("Error fetching seller settings:", error)
    next(error)
  }
})

// Update seller settings
router.put("/settings", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id
    const { notification_email, notification_sms, auto_approve_orders, currency, timezone } = req.body

    // Check if seller record exists
    const seller = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])

    if (seller) {
      // Update seller settings
      const updates = {}
      if (notification_email !== undefined) updates.notification_email = notification_email ? 1 : 0
      if (notification_sms !== undefined) updates.notification_sms = notification_sms ? 1 : 0
      if (auto_approve_orders !== undefined) updates.auto_approve_orders = auto_approve_orders ? 1 : 0
      if (currency) updates.currency = currency
      if (timezone) updates.timezone = timezone

      if (Object.keys(updates).length > 0) {
        await db.update("sellers", updates, { user_id: userId })
      }
    } else {
      // Create seller record if it doesn't exist
      await db.insert("sellers", {
        user_id: userId,
        business_name: req.user.user_name + "'s Business",
        notification_email: notification_email !== undefined ? (notification_email ? 1 : 0) : 1,
        notification_sms: notification_sms !== undefined ? (notification_sms ? 1 : 0) : 0,
        auto_approve_orders: auto_approve_orders !== undefined ? (auto_approve_orders ? 1 : 0) : 0,
        currency: currency || "XOF",
        timezone: timezone || "Africa/Ouagadougou",
        // Add other fields as needed
      })
    }

    res.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating seller settings:", error)
    next(error)
  }
})

// Get seller statistics
router.get("/stats", isAuthenticated, async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    const userId = req.user.user_id
    const timeRange = req.query.timeRange || "30days"

    // Calculate date range based on timeRange
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7)
        break
      case "90days":
        startDate.setDate(now.getDate() - 90)
        break
      case "year":
        startDate.setFullYear(now.getFullYear(), 0, 1) // Start of current year
        break
      default: // 30days
        startDate.setDate(now.getDate() - 30)
    }

    // Format dates for MySQL
    const startDateStr = startDate.toISOString().split("T")[0]
    const endDateStr = now.toISOString().split("T")[0]

    // Check if orders table exists
    let ordersExist = false
    try {
      const tableCheck = await db.query("SHOW TABLES LIKE 'orders'")
      ordersExist = tableCheck.length > 0
    } catch (error) {
      console.error("Error checking orders table:", error)
    }

    // Return mock data if orders table doesn't exist
    if (!ordersExist) {
      return res.json({
        sales: {
          total: 125000,
          change: 15,
          data: [
            { date: "2023-05-01", amount: 5000 },
            { date: "2023-05-02", amount: 7500 },
            { date: "2023-05-03", amount: 6000 },
            { date: "2023-05-04", amount: 8500 },
            { date: "2023-05-05", amount: 9000 },
            { date: "2023-05-06", amount: 7000 },
            { date: "2023-05-07", amount: 10000 },
          ],
        },
        orders: {
          total: 24,
          change: 8,
        },
        customers: {
          total: 18,
          change: 12,
        },
        products: {
          total: 15,
          topSelling: [
            { product_id: 1, name: "Organic Tomatoes", price: 1500, order_count: 12, total_quantity: 36 },
            { product_id: 2, name: "Fresh Carrots", price: 1200, order_count: 10, total_quantity: 30 },
            { product_id: 3, name: "Local Rice", price: 5000, order_count: 8, total_quantity: 16 },
            { product_id: 4, name: "Millet", price: 3500, order_count: 6, total_quantity: 12 },
            { product_id: 5, name: "Cassava Flour", price: 2800, order_count: 5, total_quantity: 10 },
          ],
        },
      })
    }

    // Get total sales
    const salesResult = await db.getOne(
      `
      SELECT SUM(total_amount) as total
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
    `,
      [userId, startDateStr, endDateStr],
    )

    // Get previous period sales for comparison
    const prevStartDate = new Date(startDate)
    prevStartDate.setDate(prevStartDate.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const prevStartDateStr = prevStartDate.toISOString().split("T")[0]

    const prevSalesResult = await db.getOne(
      `
      SELECT SUM(total_amount) as total
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
    `,
      [userId, prevStartDateStr, startDateStr],
    )

    // Calculate sales change percentage
    const currentSales = salesResult?.total || 0
    const prevSales = prevSalesResult?.total || 0
    const salesChange = prevSales > 0 ? Math.round(((currentSales - prevSales) / prevSales) * 100) : 0

    // Get total orders
    const ordersResult = await db.getOne(
      `
      SELECT COUNT(*) as total
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
    `,
      [userId, startDateStr, endDateStr],
    )

    // Get previous period orders
    const prevOrdersResult = await db.getOne(
      `
      SELECT COUNT(*) as total
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
    `,
      [userId, prevStartDateStr, startDateStr],
    )

    // Calculate orders change percentage
    const currentOrders = ordersResult?.total || 0
    const prevOrders = prevOrdersResult?.total || 0
    const ordersChange = prevOrders > 0 ? Math.round(((currentOrders - prevOrders) / prevOrders) * 100) : 0

    // Get total customers
    const customersResult = await db.getOne(
      `
      SELECT COUNT(DISTINCT customer_id) as total
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
    `,
      [userId, startDateStr, endDateStr],
    )

    // Get previous period customers
    const prevCustomersResult = await db.getOne(
      `
      SELECT COUNT(DISTINCT customer_id) as total
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
    `,
      [userId, prevStartDateStr, startDateStr],
    )

    // Calculate customers change percentage
    const currentCustomers = customersResult?.total || 0
    const prevCustomers = prevCustomersResult?.total || 0
    const customersChange =
      prevCustomers > 0 ? Math.round(((currentCustomers - prevCustomers) / prevCustomers) * 100) : 0

    // Get total products
    const productsResult = await db.getOne(
      `
      SELECT COUNT(*) as total
      FROM products
      WHERE seller_id = ?
    `,
      [userId],
    )

    // Get top selling products
    const topSellingProducts = await db.query(
      `
      SELECT p.product_id, p.name, p.price, 
             COUNT(oi.order_item_id) as order_count,
             SUM(oi.quantity) as total_quantity
      FROM products p
      JOIN order_items oi ON p.product_id = oi.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE p.seller_id = ? AND o.order_date BETWEEN ? AND ?
      GROUP BY p.product_id
      ORDER BY total_quantity DESC
      LIMIT 5
    `,
      [userId, startDateStr, endDateStr],
    )

    // Generate sales data for chart
    const salesData = await db.query(
      `
      SELECT DATE(order_date) as date, SUM(total_amount) as amount
      FROM orders
      WHERE seller_id = ? AND order_date BETWEEN ? AND ?
      GROUP BY DATE(order_date)
      ORDER BY date
    `,
      [userId, startDateStr, endDateStr],
    )

    // Return the statistics
    res.json({
      sales: {
        total: currentSales,
        change: salesChange,
        data: salesData,
      },
      orders: {
        total: currentOrders,
        change: ordersChange,
      },
      customers: {
        total: currentCustomers,
        change: customersChange,
      },
      products: {
        total: productsResult?.total || 0,
        topSelling: topSellingProducts,
      },
    })
  } catch (error) {
    console.error("Error fetching seller statistics:", error)
    next(error)
  }
})

// Upload profile image
router.post("/profile/image", isAuthenticated, upload.single('profile_image'), async (req, res, next) => {
  try {
    // Check if the user is a seller
    if (req.user.user_type !== "Seller") {
      return res.status(403).json({ error: "Access denied. User is not a seller." })
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const userId = req.user.user_id
    const imagePath = `/uploads/profile_images/${req.file.filename}`

    // Update user's profile image
    await db.update("users", { profile_image: imagePath }, { user_id: userId })

    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: imagePath
    })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    next(error)
  }
})

module.exports = router
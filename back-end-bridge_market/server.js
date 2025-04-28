require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const path = require("path")
const multer = require("multer")
const fs = require("fs")

// Import routes
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const sellerRoutes = require("./routes/sellers")
const customerRoutes = require("./routes/customers")
// Uncomment these as you implement them
// const categoryRoutes = require("./routes/categories")
// const userRoutes = require("./routes/users")

const app = express()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
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
  }
})

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads/profile_images', express.static(path.join(__dirname, 'uploads/profile_images')));

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", upload.array('images'), productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/sellers", sellerRoutes)
app.use("/api/customers", customerRoutes)
// Uncomment these as you implement them
// app.use("/api/categories", categoryRoutes)
// app.use("/api/users", userRoutes)

// Debug middleware to log request body
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body)
  }
  next()
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app // Export for testing
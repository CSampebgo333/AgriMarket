// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err)

  // If it's our custom API error, use its status code
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    })
  }

  // Handle specific error types
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      error: "A record with this information already exists",
    })
  }

  // Default error status and message
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = {
  errorHandler,
  ApiError,
}
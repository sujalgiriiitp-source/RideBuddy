/**
 * Production-grade error handler middleware
 * Handles all errors centrally with proper logging
 */
import { logger } from '../utils/logger.js'
import { ApiError } from '../utils/apiError.js'

export const globalErrorHandler = (err, req, res, next) => {
  // Default error properties
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  let errors = err.errors || null

  // Handle known error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400
    message = 'Validation error'
    errors = Object.values(err.errors).reduce((acc, e) => {
      acc[e.path] = e.message
      return acc
    }, {})
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  } else if (err.code === 11000) {
    // Mongoose duplicate key error
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `${field} already exists`
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  } else if (!(err instanceof ApiError)) {
    // Unknown error
    statusCode = 500
    logger.error('Unhandled error', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    })
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(message, {
      statusCode,
      path: req.path,
      method: req.method,
      userId: req.user?._id,
      stack: err.stack,
    })
  } else {
    logger.warn(message, {
      statusCode,
      path: req.path,
      method: req.method,
    })
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`)
  next(error)
}

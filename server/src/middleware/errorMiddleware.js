export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500
  let message = error.message || 'Something went wrong'

  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(error.errors)
      .map((value) => value.message)
      .join(', ')
  }

  if (error.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${error.path}`
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  if (error.code === 11000) {
    statusCode = 400
    const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field'
    message = `${duplicateField} already exists`
  }

  if (error.status) {
    statusCode = error.status
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}

/**
 * Custom API Error class for consistent error responses
 * Extends native Error with status code and message
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.timestamp = new Date().toISOString()

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      timestamp: this.timestamp,
    }
  }
}

export const createError = (statusCode, message, errors = null) => {
  return new ApiError(statusCode, message, errors)
}

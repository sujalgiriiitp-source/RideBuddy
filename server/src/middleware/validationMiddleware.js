/**
 * Validation middleware
 * Validates request body/query/params against Joi schema
 */
import { ApiError } from '../utils/apiError.js'

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})

      return next(new ApiError(400, 'Validation failed', errors))
    }

    // Replace body with validated value (sanitized)
    req.body = value
    next()
  }
}

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})

      return next(new ApiError(400, 'Invalid query parameters', errors))
    }

    req.query = value
    next()
  }
}

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})

      return next(new ApiError(400, 'Invalid route parameters', errors))
    }

    req.params = value
    next()
  }
}

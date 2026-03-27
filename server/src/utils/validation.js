/**
 * Joi validation schemas for all API inputs
 * Centralized validation rules for auth, users, rides
 */
import Joi from 'joi'

/**
 * Auth Validation Schemas
 */
export const authSchemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
    }),
    email: Joi.string()
      .email()
      .lowercase()
      .required()
      .messages({ 'string.email': 'Valid email is required' }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({ 'string.min': 'Password must be at least 6 characters' }),
    phone: Joi.string().optional().trim().length(10),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),
}

/**
 * Ride Validation Schemas
 */
export const rideSchemas = {
  create: Joi.object({
    from: Joi.string().trim().min(2).max(50).required(),
    to: Joi.string().trim().min(2).max(50).required(),
    date: Joi.date().iso().required(),
    time: Joi.string().optional().pattern(/^\d{2}:\d{2}$/),
    vehicle: Joi.string().valid('Bike', 'Car').optional(),
    seats: Joi.number().integer().min(1).max(6).required(),
    notes: Joi.string().optional().max(300),
  }),

  search: Joi.object({
    from: Joi.string().optional().trim(),
    to: Joi.string().optional().trim(),
    date: Joi.date().iso().optional(),
    vehicle: Joi.string().valid('Bike', 'Car').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
  }),

  rideId: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Invalid ride id',
      'string.length': 'Invalid ride id',
    }),
  }),

  updateInterest: Joi.object({
    status: Joi.string().valid('accepted', 'rejected').required().messages({
      'any.only': 'Status must be accepted or rejected',
    }),
  }),
}

/**
 * User Validation Schemas
 */
export const userSchemas = {
  updatePhoto: Joi.object({
    profilePhoto: Joi.string().uri().optional(),
  }),

  rate: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
  }),

  userId: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Invalid user id',
      'string.length': 'Invalid user id',
    }),
  }),
}

/**
 * Validate function: validates data against schema
 * Returns { error, value } tuple
 */
export const validate = (data, schema) => {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })
}

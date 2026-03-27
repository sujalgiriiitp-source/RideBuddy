import jwt from 'jsonwebtoken'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { User } from '../models/User.js'

const buildToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured')
    error.status = 500
    throw error
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body

  const normalizedEmail = email.toLowerCase()
  const duplicateConditions = [{ email: normalizedEmail }]

  if (phone) {
    duplicateConditions.push({ phone })
  }

  const existingUser = await User.findOne({
    $or: duplicateConditions,
  })

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email or phone already exists',
    })
  }

  const userPayload = { name, email: normalizedEmail, password }

  if (phone) {
    userPayload.phone = phone
  }

  const user = await User.create(userPayload)
  const token = buildToken(user._id)
  user.password = undefined

  return res.status(201).json({
    success: true,
    message: 'Signup successful',
    token,
    user,
  })
})

export const register = signup

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' })
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' })
  }

  user.password = undefined

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: buildToken(user._id),
    user,
  })
})

export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  })
})

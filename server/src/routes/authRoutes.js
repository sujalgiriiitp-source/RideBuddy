import { Router } from 'express'
import { body } from 'express-validator'
import { login, logout, signup } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateMiddleware.js'

const router = Router()

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().isLength({ min: 10, max: 15 }).withMessage('Valid phone is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  signup,
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login,
)

router.post('/logout', protect, logout)

export default router

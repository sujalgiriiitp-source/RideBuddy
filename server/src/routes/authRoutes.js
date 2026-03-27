import { Router } from 'express'
import { login, logout, register, signup } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validationMiddleware.js'
import { authSchemas } from '../utils/validation.js'

const router = Router()

router.post('/register', validateRequest(authSchemas.register), register)
router.post('/signup', validateRequest(authSchemas.register), signup)
router.post('/login', validateRequest(authSchemas.login), login)
router.post('/logout', protect, logout)

export default router

import { Router } from 'express'
import { getMyProfile, rateUser, updateProfilePhoto } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validateRequest, validateParams } from '../middleware/validationMiddleware.js'
import { userSchemas } from '../utils/validation.js'

const router = Router()

router.get('/profile', protect, getMyProfile)
router.get('/me', protect, getMyProfile)
router.patch('/me/photo', protect, validateRequest(userSchemas.updatePhoto), updateProfilePhoto)
router.post('/:id/rate', protect, validateParams(userSchemas.userId), validateRequest(userSchemas.rate), rateUser)

export default router

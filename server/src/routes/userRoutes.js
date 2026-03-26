import { Router } from 'express'
import { body, param } from 'express-validator'
import { getMyProfile, rateUser, updateProfilePhoto } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateMiddleware.js'

const router = Router()

router.get('/me', protect, getMyProfile)

router.patch(
  '/me/photo',
  protect,
  [body('profilePhoto').optional().isString().withMessage('profilePhoto must be a valid URL string')],
  validateRequest,
  updateProfilePhoto,
)

router.post(
  '/:id/rate',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('rating must be a number between 1 and 5'),
  ],
  validateRequest,
  rateUser,
)

export default router

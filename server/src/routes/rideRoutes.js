import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createRide,
  getMyJoinedRides,
  getMyPostedRides,
  getRideById,
  getRides,
  requestJoinRide,
  updateJoinRequestStatus,
} from '../controllers/rideController.js'
import { optionalAuth, protect } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateMiddleware.js'

const router = Router()

router.get(
  '/',
  [
    query('date').optional().isISO8601().withMessage('date must be in YYYY-MM-DD format'),
    query('vehicle').optional().isIn(['Bike', 'Car']).withMessage('vehicle must be Bike or Car'),
  ],
  validateRequest,
  getRides,
)

router.get('/mine/posted', protect, getMyPostedRides)
router.get('/mine/joined', protect, getMyJoinedRides)

router.post(
  '/',
  protect,
  [
    body('from').trim().notEmpty().withMessage('from is required'),
    body('to').trim().notEmpty().withMessage('to is required'),
    body('date').isISO8601().withMessage('date must be in YYYY-MM-DD format'),
    body('time').notEmpty().withMessage('time is required'),
    body('vehicle').isIn(['Bike', 'Car']).withMessage('vehicle must be Bike or Car'),
    body('seats').isInt({ min: 1, max: 6 }).withMessage('seats must be between 1 and 6'),
    body('notes').optional().isString().withMessage('notes should be text'),
  ],
  validateRequest,
  createRide,
)

router.get(
  '/:id',
  optionalAuth,
  [param('id').isMongoId().withMessage('Invalid ride id')],
  validateRequest,
  getRideById,
)

router.post(
  '/:id/join',
  protect,
  [param('id').isMongoId().withMessage('Invalid ride id')],
  validateRequest,
  requestJoinRide,
)

router.patch(
  '/interests/:interestId',
  protect,
  [
    param('interestId').isMongoId().withMessage('Invalid request id'),
    body('status')
      .isIn(['accepted', 'rejected'])
      .withMessage('status must be accepted or rejected'),
  ],
  validateRequest,
  updateJoinRequestStatus,
)

export default router

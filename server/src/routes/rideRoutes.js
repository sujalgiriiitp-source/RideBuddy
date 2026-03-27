import { Router } from 'express'
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
import { validateRequest, validateQuery, validateParams } from '../middleware/validationMiddleware.js'
import { rideSchemas } from '../utils/validation.js'

const router = Router()

router.get('/', validateQuery(rideSchemas.search), getRides)
router.get('/mine/posted', protect, getMyPostedRides)
router.get('/mine/joined', protect, getMyJoinedRides)
router.post('/', protect, validateRequest(rideSchemas.create), createRide)
router.get('/:id', optionalAuth, validateParams(rideSchemas.rideId), getRideById)
router.post('/:id/join', protect, validateParams(rideSchemas.rideId), requestJoinRide)
router.patch('/interests/:interestId', protect, validateRequest(rideSchemas.updateInterest), updateJoinRequestStatus)

export default router

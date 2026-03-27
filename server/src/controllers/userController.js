import { Ride } from '../models/Ride.js'
import { RideInterest } from '../models/RideInterest.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getMyProfile = asyncHandler(async (req, res) => {
  const postedRides = await Ride.find({ createdBy: req.user._id }).sort({ date: -1 })

  const acceptedInterests = await RideInterest.find({
    userId: req.user._id,
    status: 'accepted',
  })
    .populate({
      path: 'rideId',
      populate: { path: 'createdBy', select: 'name phone averageRating profilePhoto' },
    })
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    user: req.user,
    ridesPosted: postedRides,
    rideHistory: acceptedInterests.map((interest) => interest.rideId).filter(Boolean),
  })
})

export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const { profilePhoto } = req.body

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profilePhoto },
    { new: true },
  )

  return res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully',
    user: updatedUser,
  })
})

export const rateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { rating } = req.body

  if (String(id) === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot rate yourself' })
  }

  const targetUser = await User.findById(id)

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }

  targetUser.rating.sum += rating
  targetUser.rating.count += 1

  await targetUser.save()

  return res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    averageRating: targetUser.averageRating,
  })
})

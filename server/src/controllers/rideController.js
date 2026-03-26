import { Ride } from '../models/Ride.js'
import { RideInterest } from '../models/RideInterest.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const getDateRangeFilter = (dateValue) => {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { $gte: start, $lte: end }
}

export const createRide = asyncHandler(async (req, res) => {
  const { from, to, date, time, vehicle, seats, notes } = req.body

  const ride = await Ride.create({
    from,
    to,
    date,
    time,
    vehicle,
    seats,
    availableSeats: seats,
    notes,
    userId: req.user._id,
  })

  return res.status(201).json({
    success: true,
    message: 'Ride posted successfully',
    ride,
  })
})

export const getRides = asyncHandler(async (req, res) => {
  const { from, to, date, vehicle } = req.query
  const filter = {}

  if (from) {
    filter.from = { $regex: from, $options: 'i' }
  }

  if (to) {
    filter.to = { $regex: to, $options: 'i' }
  }

  if (vehicle) {
    filter.vehicle = vehicle
  }

  if (date) {
    const dateFilter = getDateRangeFilter(date)

    if (dateFilter) {
      filter.date = dateFilter
    }
  }

  const rides = await Ride.find(filter)
    .populate('userId', 'name phone profilePhoto rating')
    .sort({ date: 1, time: 1 })

  return res.status(200).json({ success: true, rides })
})

export const getRideById = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id)
    .populate('userId', 'name phone profilePhoto rating')
    .populate('participants', 'name phone profilePhoto rating')

  if (!ride) {
    return res.status(404).json({ success: false, message: 'Ride not found' })
  }

  const interestFilter = { rideId: ride._id, status: 'accepted' }

  if (req.user && String(req.user._id) === String(ride.userId._id)) {
    interestFilter.status = { $in: ['pending', 'accepted', 'rejected'] }
  }

  const interests = await RideInterest.find(interestFilter)
    .populate('userId', 'name phone profilePhoto rating')
    .sort({ createdAt: -1 })

  return res.status(200).json({ success: true, ride, interests })
})

export const requestJoinRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id)

  if (!ride) {
    return res.status(404).json({ success: false, message: 'Ride not found' })
  }

  if (String(ride.userId) === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot join your own ride' })
  }

  const existingRequest = await RideInterest.findOne({
    userId: req.user._id,
    rideId: ride._id,
  })

  if (existingRequest) {
    return res.status(400).json({
      success: false,
      message: 'You already requested this ride',
    })
  }

  const request = await RideInterest.create({
    userId: req.user._id,
    rideId: ride._id,
    message: req.body.message || '',
  })

  return res.status(201).json({
    success: true,
    message: 'Join request sent successfully',
    request,
  })
})

export const updateJoinRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const request = await RideInterest.findById(req.params.interestId)

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' })
  }

  const ride = await Ride.findById(request.rideId)

  if (!ride) {
    return res.status(404).json({ success: false, message: 'Ride not found' })
  }

  if (String(ride.userId) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Only the ride owner can update join requests',
    })
  }

  if (status === 'accepted') {
    if (ride.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available' })
    }

    if (request.status !== 'accepted') {
      ride.availableSeats -= 1
      if (!ride.participants.includes(request.userId)) {
        ride.participants.push(request.userId)
      }
    }
  }

  if (request.status === 'accepted' && status === 'rejected') {
    ride.availableSeats += 1
    ride.participants = ride.participants.filter(
      (participantId) => String(participantId) !== String(request.userId),
    )
  }

  request.status = status

  await Promise.all([request.save(), ride.save()])

  return res.status(200).json({
    success: true,
    message: `Request ${status}`,
    request,
    availableSeats: ride.availableSeats,
  })
})

export const getMyPostedRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find({ userId: req.user._id })
    .populate('participants', 'name phone profilePhoto rating')
    .sort({ date: -1 })

  const rideIds = rides.map((ride) => ride._id)
  const requests = await RideInterest.find({ rideId: { $in: rideIds } })
    .populate('userId', 'name phone profilePhoto rating')
    .sort({ createdAt: -1 })

  const requestsByRide = requests.reduce((acc, request) => {
    const key = String(request.rideId)

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(request)
    return acc
  }, {})

  return res.status(200).json({ success: true, rides, requestsByRide })
})

export const getMyJoinedRides = asyncHandler(async (req, res) => {
  const acceptedRequests = await RideInterest.find({ userId: req.user._id, status: 'accepted' })
    .populate({
      path: 'rideId',
      populate: { path: 'userId', select: 'name phone profilePhoto rating' },
    })
    .sort({ updatedAt: -1 })

  const rides = acceptedRequests.map((request) => request.rideId).filter(Boolean)

  return res.status(200).json({ success: true, rides })
})

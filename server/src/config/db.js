import mongoose from 'mongoose'
import { RideInterest } from '../models/RideInterest.js'
import { User } from '../models/User.js'
import { Ride } from '../models/Ride.js'

const ensureUserPhoneIndex = async () => {
  try {
    const indexes = await User.collection.indexes()
    const phoneIndex = indexes.find((index) => index.name === 'phone_1')

    if (!phoneIndex) {
      await User.collection.createIndex({ phone: 1 }, { unique: true, sparse: true })
      return
    }

    const isSparseUnique = Boolean(phoneIndex.unique && phoneIndex.sparse)

    if (!isSparseUnique) {
      await User.collection.dropIndex('phone_1')
      await User.collection.createIndex({ phone: 1 }, { unique: true, sparse: true })
    }
  } catch (error) {
    console.warn('User phone index check skipped:', error.message)
  }
}

const ensureRideInterestIndex = async () => {
  try {
    const indexes = await RideInterest.collection.indexes()
    const legacyIndex = indexes.find((index) => index.name === 'ride_1_interestedUser_1')

    if (legacyIndex) {
      await RideInterest.collection.dropIndex('ride_1_interestedUser_1')
    }

    const currentIndex = indexes.find((index) => index.name === 'userId_1_rideId_1')

    if (!currentIndex) {
      await RideInterest.collection.createIndex({ userId: 1, rideId: 1 }, { unique: true })
    }
  } catch (error) {
    console.warn('RideInterest index check skipped:', error.message)
  }
}

const ensureRideIndexes = async () => {
  try {
    // Compound index for location and date searches
    await Ride.collection.createIndex({ from: 1, to: 1, date: 1 })
    // Index for date range queries
    await Ride.collection.createIndex({ date: 1 })
    // Index for createdBy to find user's rides quickly
    await Ride.collection.createIndex({ createdBy: 1 })
    // Index for vehicle type filtering
    await Ride.collection.createIndex({ vehicle: 1 })
  } catch (error) {
    // Ignore if indexes already exist
    if (!error.message.includes('E11000') && !error.message.includes('already exists')) {
      console.warn('Ride indexes check skipped:', error.message)
    }
  }
}

const ensureUserIndexes = async () => {
  try {
    // Index for email lookups (already unique from schema)
    await User.collection.createIndex({ email: 1 })
  } catch (error) {
    // Ignore if indexes already exist
    if (!error.message.includes('E11000') && !error.message.includes('already exists')) {
      console.warn('User indexes check skipped:', error.message)
    }
  }
}

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridebuddy'

  if (isProduction && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in production')
  }

  if (!isProduction && !process.env.MONGO_URI) {
    console.warn('MONGO_URI not set. Using local default mongodb://127.0.0.1:27017/ridebuddy')
  }

  await mongoose.connect(mongoUri)
  await ensureUserPhoneIndex()
  await ensureRideInterestIndex()
  await ensureRideIndexes()
  await ensureUserIndexes()
  console.log('MongoDB connected successfully with all indexes')
}

import mongoose from 'mongoose'

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
  console.log('MongoDB connected successfully')
}

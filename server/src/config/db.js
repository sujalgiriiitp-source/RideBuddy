import mongoose from 'mongoose'

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridebuddy'

  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set. Using local default mongodb://127.0.0.1:27017/ridebuddy')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected successfully')
}

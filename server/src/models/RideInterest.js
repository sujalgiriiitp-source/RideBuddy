import mongoose from 'mongoose'

const rideInterestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true },
)

rideInterestSchema.index({ userId: 1, rideId: 1 }, { unique: true })

export const RideInterest = mongoose.model('RideInterest', rideInterestSchema)

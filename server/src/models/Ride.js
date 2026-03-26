import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    vehicle: {
      type: String,
      enum: ['Bike', 'Car'],
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 300,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
)

export const Ride = mongoose.model('Ride', rideSchema)

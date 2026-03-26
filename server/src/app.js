import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import rideRoutes from './routes/rideRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173']

const allowAllOrigins = allowedOrigins.includes('*')

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      const corsError = new Error('CORS not allowed for this origin')
      corsError.status = 403
      return callback(corsError)
    },
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'RideBuddy API is live' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rides', rideRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app

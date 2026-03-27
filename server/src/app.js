import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import rideRoutes from './routes/rideRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'

dotenv.config()

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173']

const allowAllOrigins = allowedOrigins.includes('*')

// Security middleware
app.use(helmet()) // Add security headers

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// More strict rate limit for auth endpoints (10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later',
})

// CORS configuration
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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
)

app.get('/', (req, res) => {
  res.send('RideBuddy API Running 🚀')
})

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'RideBuddy API is live' })
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working perfectly 💯' })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rides', rideRoutes)

// 404 and error handling
app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app

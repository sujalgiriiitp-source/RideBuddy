import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'
import { connectDB } from './config/db.js'
import { logger } from './utils/logger.js'

dotenv.config()

const startServer = async () => {
  const rawPort = process.env.PORT
  const parsedPort = Number.parseInt(rawPort || '5000', 10)
  const port = Number.isNaN(parsedPort) ? 5000 : parsedPort
  const host = '0.0.0.0'

  try {
    await connectDB()

    const server = app.listen(port, host, () => {
      console.log(`RideBuddy server running on http://${host}:${port}`)
      console.log(`Startup config: NODE_ENV=${process.env.NODE_ENV || 'development'} PORT=${rawPort || port}`)
    })

    server.on('error', (error) => {
      console.error('Server listen error during startup:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      })
      process.exit(1)
    })

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`)
      logger.info(`${signal} signal received, initiating graceful shutdown`)

      server.close(async () => {
        try {
          await mongoose.disconnect()
          logger.info('MongoDB connection closed')
          console.log('Graceful shutdown completed')
          process.exit(0)
        } catch (error) {
          logger.error('Error during graceful shutdown:', error)
          process.exit(1)
        }
      })

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('Forced shutdown after 30 seconds')
        process.exit(1)
      }, 30000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  } catch (error) {
    console.error('Failed to start server:', {
      message: error.message,
      stack: error.stack,
      nodeEnv: process.env.NODE_ENV,
      port: rawPort,
      hasMongoUri: Boolean(process.env.MONGO_URI),
    })
    logger.error('Server startup failed', error)
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason)
  logger.error('Unhandled Promise Rejection:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

startServer()

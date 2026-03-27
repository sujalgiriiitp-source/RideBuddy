import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

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
  } catch (error) {
    console.error('Failed to start server:', {
      message: error.message,
      stack: error.stack,
      nodeEnv: process.env.NODE_ENV,
      port: rawPort,
      hasMongoUri: Boolean(process.env.MONGO_URI),
    })
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

startServer()

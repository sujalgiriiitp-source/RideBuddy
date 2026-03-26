import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const startServer = async () => {
  try {
    await connectDB()

    const port = Number(process.env.PORT) || 5000
    const host = '0.0.0.0'

    const server = app.listen(port, host, () => {
      console.log(`RideBuddy server running on http://${host}:${port}`)
    })

    server.on('error', (error) => {
      console.error('Server listen error:', error)
      process.exit(1)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
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

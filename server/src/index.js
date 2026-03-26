import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const listenWithFallback = (preferredPort, maxAttempts = 10) => {
  const startPort = Number(preferredPort)

  const tryListen = (port, attemptsLeft) => {
    const server = app.listen(port, () => {
      if (port !== startPort) {
        console.warn(`Preferred port ${startPort} is busy. Using fallback port ${port}.`)
      }
      console.log(`RideBuddy server running on port ${port}`)
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
        tryListen(port + 1, attemptsLeft - 1)
        return
      }

      if (error.code === 'EADDRINUSE') {
        console.error(
          `No free port found from ${startPort} to ${port}. Set PORT to an available value and retry.`,
        )
      } else {
        console.error('Server listen error:', error.message)
      }

      process.exit(1)
    })
  }

  tryListen(startPort, maxAttempts)
}

const startServer = async () => {
  try {
    await connectDB()

    if (process.env.PORT) {
      const deploymentPort = Number(process.env.PORT)
      app.listen(deploymentPort, () => {
        console.log(`RideBuddy server running on port ${deploymentPort}`)
      })
      return
    }

    const localPort = 5000
    listenWithFallback(localPort)
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()

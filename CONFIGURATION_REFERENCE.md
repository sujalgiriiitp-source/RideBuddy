# RideBuddy Configuration Reference
## Complete Code Examples for Production

---

## Backend Configuration

### 1. Backend `.env` File
**Location:** `server/.env`

```dotenv
# ============================================================================
# RIDEBUDDY BACKEND - Production Configuration
# ============================================================================

# CRITICAL: JWT Secret for signing authentication tokens
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ridebuddy

# Server Configuration
PORT=5001
NODE_ENV=production

# Frontend URL (for CORS)
# This should match your Vercel deployment URL
FRONTEND_URL=https://ride-buddy-liart.vercel.app

# Optional: Additional frontend URLs
# CLIENT_URL=https://ride-buddy-liart.vercel.app,https://custom-domain.com
```

### 2. Backend CORS Configuration
**Location:** `server/src/app.js`

```javascript
import cors from 'cors'

// Validate critical environment variables at startup
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Auth will fail. Check your .env file.')
}

// CORS configuration with environment support
const allowedOrigins = [
  'http://localhost:5173',           // Dev port 1
  'http://localhost:5174',           // Dev port 2 (fallback)
  'https://ride-buddy-liart.vercel.app',  // Production Vercel domain
]

// Add additional origins from environment
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL)
}

// Azure backend doesn't need to be in CORS origins (it's the server, not client)
// VITE_API_URL on Vercel should point to Azure backend URL

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // Preflight cache: 24 hours
  }),
)

// Handle preflight OPTIONS requests explicitly
app.options('*', cors())
```

### 3. Environment Variable Validation
**Location:** `server/src/index.js`

```javascript
import dotenv from 'dotenv'

dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:')
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`)
  })
  console.error('\n📝 Fix: Create/update .env file with all required variables')
  console.error('   See .env.example for the required format\n')
  process.exit(1)
}

// Server starts only if all env vars are configured
const startServer = async () => {
  // ... rest of startup code
}
```

### 4. JWT Token Generation
**Location:** `server/src/controllers/authController.js`

```javascript
import jwt from 'jsonwebtoken'

const buildToken = (userId) => {
  // Validate JWT_SECRET exists before generating token
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured')
    error.status = 500
    throw error
  }

  // Sign token with 7-day expiry
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone: req.body.phone }]
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists',
      })
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    })

    // Generate token (will throw if JWT_SECRET not set)
    const token = buildToken(user._id)

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    })
  }
}
```

---

## Frontend Configuration

### 1. Frontend `.env` File
**Location:** `client/.env`

```dotenv
# ============================================================================
# RIDEBUDDY FRONTEND - Development Configuration
# ============================================================================

# API URL - Development uses local proxy
VITE_API_URL=/api

# Vite dev server proxy target (points to backend)
VITE_PROXY_TARGET=http://localhost:5001

# Native app API URL (for Capacitor mobile app)
VITE_NATIVE_API_URL=https://your-azure-backend.azurewebsites.net/api
```

### 2. Frontend `.env.production` (Optional)
**Location:** `client/.env.production`

```dotenv
# ============================================================================
# RIDEBUDDY FRONTEND - Production Configuration
# ============================================================================

# This is set on Vercel dashboard, but can also be set here
VITE_API_URL=https://your-azure-backend.azurewebsites.net/api
```

### 3. API Service Configuration
**Location:** `client/src/services/api.js`

```javascript
import axios from 'axios'
import { Capacitor } from '@capacitor/core'

// Resolve API base URL based on environment and platform
const resolveApiBaseUrl = () => {
  const webApiUrl = import.meta.env.VITE_API_URL?.trim()
  const nativeApiUrl = import.meta.env.VITE_NATIVE_API_URL?.trim()
  const isNativePlatform = Capacitor.isNativePlatform()

  // For native mobile app
  if (isNativePlatform) {
    if (nativeApiUrl) {
      console.log('[API] Using native API URL:', nativeApiUrl)
      return nativeApiUrl
    }
    if (webApiUrl && !webApiUrl.startsWith('/')) {
      console.log('[API] Using web API URL for native:', webApiUrl)
      return webApiUrl
    }
  }

  // For web (dev and production)
  if (webApiUrl) {
    console.log('[API] Using VITE_API_URL:', webApiUrl)
    return webApiUrl
  }

  // Development fallback (local proxy)
  console.log('[API] Using default /api (local proxy in dev)')
  return '/api'
}

const API_BASE_URL = resolveApiBaseUrl()

// Create Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable credentials (cookies, auth headers)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ridebuddy_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Response interceptor: Handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ridebuddy_token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  },
)

export const signup = (userData) => api.post('/auth/signup', userData)
export const login = (credentials) => api.post('/auth/login', credentials)
export const logout = () => api.post('/auth/logout')
```

### 4. Vite Configuration
**Location:** `client/vite.config.js`

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Dev: /api calls proxy to backend
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
```

### 5. Vercel Configuration
**Location:** `client/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "vite",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_NATIVE_API_URL": "@vite_native_api_url"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Environment Variable Setup

### Azure Backend Setup

**Step 1:** In Azure Portal, go to your App Service

**Step 2:** Click **Settings** → **Environment Variables** (or **Configuration**)

**Step 3:** Add these variables:

| Name | Value | Notes |
|------|-------|-------|
| `JWT_SECRET` | `a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5` | Generate your own with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ridebuddy` | Your MongoDB Atlas connection string |
| `NODE_ENV` | `production` | Sets app to production mode |
| `PORT` | `5001` | Or use Azure's default |
| `FRONTEND_URL` | `https://ride-buddy-liart.vercel.app` | Your Vercel frontend URL |

**Step 4:** Click **Save**

**Step 5:** Restart the App Service

### Vercel Frontend Setup

**Step 1:** Go to **Vercel Dashboard** → Click your project

**Step 2:** Click **Settings** → **Environment Variables**

**Step 3:** Add this variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://your-azure-backend.azurewebsites.net/api` | Production |

**Example values:**
- If using standard Azure: `https://ridebuddy-prod.azurewebsites.net/api`
- If using custom domain: `https://api.ridebuddy.com/api`

**Step 4:** Click **Save**

**Step 5:** Vercel auto-redeploys (takes 2-3 minutes)

---

## Testing Configuration

### Test Backend Health

```bash
# If backend is on Azure
curl https://your-azure-url/api/health
# Expected response: {"success": true, "message": "RideBuddy API is live"}

# If backend is localhost
curl http://localhost:5001/api/health
```

### Test Signup with CORS

```bash
# Test from frontend origin (Vercel)
curl -X POST https://your-azure-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: https://ride-buddy-liart.vercel.app" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Signup successful",
#   "token": "eyJhbGc...",
#   "user": { "id": "...", "name": "Test User", ... }
# }
```

### Test API URL Resolution (Browser Console)

When page loads, check browser console for:

```javascript
// In development
[API] Using VITE_API_URL: /api
[API] Using VITE_PROXY_TARGET: http://localhost:5001

// In production (Vercel)
[API] Using VITE_API_URL: https://your-azure-url/api
```

---

## Common Issues & Fixes

### 1. JWT_SECRET Not Configured

**Error:**
```
Error: JWT_SECRET is not configured
```

**Fix:**
1. Set `JWT_SECRET` in Azure environment variables (not in code)
2. Restart Azure App Service
3. Check startup logs to verify it loaded

### 2. Vercel 404 on Refresh

**Error:**
```
GET https://ride-buddy-liart.vercel.app/auth 404 NOT_FOUND
```

**Fix:**
1. Ensure `vercel.json` exists in `client/` directory
2. Contains `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`
3. Commit and push to GitHub
4. Wait for Vercel redeploy (2-3 minutes)

### 3. API URL is Undefined

**Error:**
```
Uncaught Error: Cannot fetch from undefined
```

**Fix:**
1. Set `VITE_API_URL` on Vercel dashboard
2. Check browser console for: `[API] Using VITE_API_URL: ...`
3. Value should be your Azure backend URL
4. Not `/api` (that's for local dev only)

### 4. CORS Error

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
1. Check backend CORS origins include your Vercel URL
2. Set `FRONTEND_URL` in Azure to your Vercel URL
3. Backend reads this and adds to CORS origins
4. Restart Azure App Service

---

## Quick Commands

```bash
# Generate secure JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test backend health
curl https://your-azure-url/api/health

# Check if vercel.json exists
cat client/vercel.json

# View current frontend environment variables
cat client/.env

# View current backend environment variables (only on local machine)
cat server/.env
```

---

## Summary

| Component | Configuration | Status |
|-----------|---------------|--------|
| Backend JWT_SECRET | Azure Env Vars | ✅ Critical |
| Backend CORS | `app.js` + Azure `FRONTEND_URL` | ✅ Done |
| Frontend API URL | Vercel `VITE_API_URL` | ✅ Critical |
| Vercel SPA Routing | `vercel.json` | ✅ Done |
| Token Management | `api.js` interceptors | ✅ Done |

All configurations are production-ready! ✅

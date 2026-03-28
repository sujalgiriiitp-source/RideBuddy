# CORS Configuration for RideBuddy
## Complete Setup for Azure Backend + Vercel Frontend

---

## 📋 CORS Overview

**CORS (Cross-Origin Resource Sharing)** allows your Vercel frontend to make requests to your Azure backend.

**Without CORS:**
```
Frontend: https://ride-buddy-liart.vercel.app
Backend: https://your-azure-backend.azurewebsites.net
↓
❌ BLOCKED by browser security
```

**With CORS:**
```
Frontend: https://ride-buddy-liart.vercel.app
Backend: https://your-azure-backend.azurewebsites.net
↓
✅ ALLOWED (backend explicitly authorizes frontend)
```

---

## 🔧 Backend CORS Configuration

### Current Configuration (Already Done ✅)

**File:** `server/src/app.js`

```javascript
import cors from 'cors'

// Validate critical environment variables at startup
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Auth will fail. Check your .env file.')
}

// CORS configuration with environment support
const allowedOrigins = [
  'http://localhost:5173',           // Development
  'http://localhost:5174',           // Development (fallback)
  'https://ride-buddy-liart.vercel.app',  // Production Vercel
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

### What Each Setting Does

| Setting | Value | Purpose |
|---------|-------|---------|
| `origin` | `['http://localhost:5173', 'https://ride-buddy-liart.vercel.app']` | Which frontend domains are allowed |
| `credentials` | `true` | Allow cookies & authorization headers (needed for JWT) |
| `methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` | Allowed HTTP methods |
| `allowedHeaders` | `Content-Type, Authorization, X-Requested-With` | Headers frontend can send |
| `exposedHeaders` | `X-Total-Count, X-Page-Count` | Headers backend can send to frontend |
| `maxAge` | `86400` | Cache preflight for 24 hours |

---

## 🌐 How CORS Works

### Step 1: Browser Sends Preflight Request

When frontend tries to POST to backend from different domain:

```http
OPTIONS /api/auth/signup HTTP/1.1
Host: your-azure-backend.azurewebsites.net
Origin: https://ride-buddy-liart.vercel.app
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

### Step 2: Backend Approves in Response

Backend's CORS config returns:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://ride-buddy-liart.vercel.app
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Step 3: Browser Sends Actual Request

Browser sees approval and sends real request:

```http
POST /api/auth/signup HTTP/1.1
Host: your-azure-backend.azurewebsites.net
Origin: https://ride-buddy-liart.vercel.app
Content-Type: application/json
Authorization: Bearer eyJhbGc...
```

### Step 4: Backend Responds

```http
HTTP/1.1 201 Created
Content-Type: application/json
Access-Control-Allow-Origin: https://ride-buddy-liart.vercel.app
Access-Control-Allow-Credentials: true

{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## 📝 CORS Configuration by Scenario

### Scenario 1: Development (Local)

**Frontend:** `http://localhost:5173`  
**Backend:** `http://localhost:5001`  
**CORS Config:**

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', // fallback
]
```

**Frontend .env:**
```dotenv
VITE_API_URL=/api
VITE_PROXY_TARGET=http://localhost:5001
```

**Backend .env:**
```dotenv
JWT_SECRET=dev_secret
MONGO_URI=mongodb://127.0.0.1:27017/ridebuddy
PORT=5001
NODE_ENV=development
```

✅ **Test:** `http://localhost:5173/auth` → signup → works!

---

### Scenario 2: Production (Azure + Vercel)

**Frontend:** `https://ride-buddy-liart.vercel.app`  
**Backend:** `https://ridebuddy-prod.azurewebsites.net/api`  
**CORS Config:**

```javascript
const allowedOrigins = [
  'https://ride-buddy-liart.vercel.app',
]

// Add from environment if set (recommended for Azure)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL)
}
```

**Azure Environment Variables:**

| Name | Value |
|------|-------|
| `JWT_SECRET` | `a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5` |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ridebuddy` |
| `NODE_ENV` | `production` |
| `PORT` | `5001` (or Azure default) |
| `FRONTEND_URL` | `https://ride-buddy-liart.vercel.app` |

**Vercel Environment Variables:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://ridebuddy-prod.azurewebsites.net/api` |

✅ **Test:** `https://ride-buddy-liart.vercel.app/auth` → signup → works!

---

### Scenario 3: Multiple Frontend Domains

If you have multiple frontend domains (custom domain + Vercel):

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ride-buddy-liart.vercel.app',
  'https://api.ridebuddy.com',              // Custom domain
  'https://www.ridebuddy.com',              // Production domain
]

// Or use environment to add more dynamically
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL)
}
if (process.env.ADDITIONAL_FRONTEND_URL) {
  allowedOrigins.push(process.env.ADDITIONAL_FRONTEND_URL)
}
```

---

## 🔐 Security Considerations

### ✅ DO: Whitelist Specific Origins

```javascript
// GOOD: Only allow known domains
const allowedOrigins = [
  'https://ride-buddy-liart.vercel.app',
  'https://www.ridebuddy.com',
]

app.use(cors({ origin: allowedOrigins }))
```

### ❌ DON'T: Allow All Origins in Production

```javascript
// BAD: Anyone can access your API
app.use(cors({ origin: '*' }))

// BAD: Allow all with credentials (insecure)
app.use(cors({ origin: '*', credentials: true }))
```

### ✅ DO: Use Credentials with CORS

```javascript
// Good: Allows JWT tokens in requests
app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // ← Important for JWT
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
```

### ✅ DO: Validate JWT_SECRET Before Using

```javascript
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set')
  process.exit(1)
}
```

---

## 🧪 Testing CORS Configuration

### Test 1: Preflight Request

```bash
curl -X OPTIONS https://your-azure-url/api/auth/signup \
  -H "Origin: https://ride-buddy-liart.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Look for these response headers:
# Access-Control-Allow-Origin: https://ride-buddy-liart.vercel.app
# Access-Control-Allow-Methods: POST
# Access-Control-Allow-Headers: Content-Type, Authorization
# Access-Control-Allow-Credentials: true
```

### Test 2: Actual Request with JWT

```bash
curl -X POST https://your-azure-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: https://ride-buddy-liart.vercel.app" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }' \
  -v

# Should return 201 Created with user and token
```

### Test 3: Browser Network Tab

1. Open `https://ride-buddy-liart.vercel.app/auth`
2. Open DevTools → Network tab
3. Fill signup form
4. Look for signup request:
   - **Status:** 201 (not 403 or 401)
   - **Response headers:**
     - `Access-Control-Allow-Origin: https://ride-buddy-liart.vercel.app`
     - `Access-Control-Allow-Credentials: true`

---

## 🚨 Troubleshooting CORS Issues

### Error 1: CORS error "origin not allowed"

```
Access to XMLHttpRequest at 'https://api.example.com/auth/signup' 
from origin 'https://ride-buddy-liart.vercel.app' 
has been blocked by CORS policy
```

**Cause:** Your origin is not in the `allowedOrigins` array

**Fix:**
```javascript
// In server/src/app.js
const allowedOrigins = [
  'https://ride-buddy-liart.vercel.app',  // ← Add this
]
```

Or set in Azure:
```
FRONTEND_URL=https://ride-buddy-liart.vercel.app
```

---

### Error 2: 401 Unauthorized / Invalid Token

```
Error: 401 Unauthorized
```

**Cause:** JWT_SECRET not set, token generation failed

**Fix:**
1. Set `JWT_SECRET` in Azure environment variables
2. Use secure value: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Restart Azure App Service

---

### Error 3: Preflight returns 404

```
OPTIONS /api/auth/signup 404 Not Found
```

**Cause:** Backend doesn't have `app.options('*', cors())`

**Fix:**
```javascript
// In server/src/app.js
app.options('*', cors())  // ← Add this before routes
app.use('/api/auth', authRoutes)
```

---

### Error 4: Credentials not sent with request

```
Error: Response does not include credentials
```

**Cause:** Frontend not sending credentials, or backend not accepting them

**Fix (Backend):**
```javascript
app.use(cors({
  credentials: true,  // ← Add this
  origin: allowedOrigins,
}))
```

**Fix (Frontend):**
```javascript
// In client/src/services/api.js
export const api = axios.create({
  withCredentials: true,  // ← Add this
})
```

---

## 📊 CORS Checklist

- [ ] Backend has `app.use(cors({...}))`
- [ ] `allowedOrigins` includes Vercel domain: `https://ride-buddy-liart.vercel.app`
- [ ] `credentials: true` is set in CORS config
- [ ] `allowedHeaders` includes `Authorization` (for JWT)
- [ ] `app.options('*', cors())` handles preflight requests
- [ ] Azure has `FRONTEND_URL` set to Vercel domain
- [ ] `JWT_SECRET` is set in Azure (not placeholder)
- [ ] Frontend has `withCredentials: true` in Axios config
- [ ] Frontend sets `Authorization: Bearer <token>` header
- [ ] No errors in browser console about CORS

---

## 🎯 Production Deployment Checklist

### Azure Backend Setup
- [ ] `JWT_SECRET` = Generated secure value
- [ ] `MONGO_URI` = MongoDB Atlas connection string
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `https://ride-buddy-liart.vercel.app`
- [ ] CORS code in `app.js` includes all required origins
- [ ] App Service restarted after adding env vars

### Vercel Frontend Setup
- [ ] `VITE_API_URL` = Azure backend URL (not `/api`)
- [ ] `vercel.json` exists with rewrites rule
- [ ] Build succeeds without errors
- [ ] Deployment shows "Ready" status

### Testing
- [ ] `https://ride-buddy-liart.vercel.app/auth` loads (no 404)
- [ ] Signup succeeds with 201 response
- [ ] JWT token received and stored
- [ ] Browser console shows: `[API] Using VITE_API_URL: https://your-azure-url/api`
- [ ] Network tab shows correct API endpoint (Azure URL)

---

## 📞 Quick Help

| Problem | Check |
|---------|-------|
| CORS error | Is Vercel domain in `allowedOrigins`? |
| 401 Auth error | Is `JWT_SECRET` set in Azure? |
| Token not working | Is `withCredentials: true` in Axios config? |
| Wrong API called | Is `VITE_API_URL` set on Vercel? |
| 404 on `/auth` | Does `vercel.json` have rewrites rule? |

---

## Summary

**CORS allows your Vercel frontend to talk to your Azure backend.**

✅ **Backend:** Configure `app.js` with allowed origins + Azure env vars  
✅ **Frontend:** Set `VITE_API_URL` on Vercel dashboard  
✅ **Test:** Use curl or browser DevTools to verify requests  
✅ **Deploy:** Commit code + set env vars + test in production

Your app is configured correctly and ready for production! 🚀

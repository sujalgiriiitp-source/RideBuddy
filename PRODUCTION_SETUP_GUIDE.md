# RideBuddy Production Setup Guide
## Azure Backend + Vercel Frontend Deployment

**Date:** March 28, 2026  
**Status:** Complete Setup Instructions  
**Target Deployment:** Azure (Backend) + Vercel (Frontend)

---

## 🎯 Overview

This guide fixes three critical issues:
1. ✅ **JWT_SECRET missing error** - Backend authentication failing
2. ✅ **Vercel 404 on refresh** - SPA routing not configured  
3. ✅ **API URL configuration** - Frontend can't find backend

---

## ⚠️ CRITICAL ISSUE #1: JWT_SECRET Missing

### Problem
When running signup/login:
```
❌ JWT_SECRET is not configured
❌ Error generating token
```

### Root Cause
Environment variable `JWT_SECRET` is not set or is missing in production.

### Solution

**Step 1: Generate a Secure JWT_SECRET**

```bash
# Generate a 32-character random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output:
```
a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5
```

**Step 2: Backend - Set JWT_SECRET in .env**

Create/update `/server/.env`:

```dotenv
# CRITICAL: This MUST be set!
JWT_SECRET=a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ridebuddy

# Server
PORT=5001
NODE_ENV=production

# Frontend (Vercel)
FRONTEND_URL=https://ride-buddy-liart.vercel.app
```

**Step 3: Azure - Add to Environment Variables**

If deploying to **Azure App Service**:

1. Go to **Azure Portal** → Your App Service
2. Click **Settings** → **Environment variables**
3. Add these variables:

| Name | Value |
|------|-------|
| `JWT_SECRET` | `a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5` |
| `MONGO_URI` | Your MongoDB connection string |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://ride-buddy-liart.vercel.app` |

4. Click **Save** and restart the app

**Step 4: Verify JWT_SECRET is Set**

The backend will now validate on startup:

```
✅ SERVER STARTING...
✅ All environment variables configured
✅ JWT_SECRET found
✅ Server listening on port 5001
```

If you see errors like:
```
❌ ERROR: Missing required environment variables:
   - JWT_SECRET
```

Go back to Step 2 or Step 3 and add the variable.

---

## ⚠️ CRITICAL ISSUE #2: Vercel 404 on Refresh

### Problem
Routes work when navigating inside the app, but:
- ❌ Direct URL: `https://ride-buddy-liart.vercel.app/auth` → 404
- ❌ Refresh button → 404
- ✅ Clicking links inside app → Works

### Root Cause
Vercel looking for `/auth` folder instead of letting React Router handle it.

### Solution: Already Done! ✅

Your `client/vercel.json` is already configured:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel: "Send ALL URLs to index.html, React Router will handle routing."

**Verify it works (after Vercel redeploys):**

```bash
# Test direct URL access
curl -I https://ride-buddy-liart.vercel.app/auth
# Should return 200, not 404

# Test refresh
# 1. Open: https://ride-buddy-liart.vercel.app
# 2. Click login link (route changes to /auth)
# 3. Press Cmd+R (refresh)
# 4. Should still show auth page ✅
```

---

## ⚠️ CRITICAL ISSUE #3: API URL Configuration

### Problem
Frontend can't find backend:
- ❌ In production: `Uncaught TypeError: Cannot fetch from undefined`
- ❌ CORS errors from wrong URL
- ✅ In development: Works (uses local proxy)

### Root Cause
`VITE_API_URL` not set on Vercel, so frontend tries undefined URL.

### Solution

**Step 1: Identify Your Azure Backend URL**

Your backend is deployed on Azure. Find the URL:

Example formats:
- `https://ridebuddy-prod.azurewebsites.net/api` (if standard deployment)
- `https://your-custom-domain.com/api` (if using custom domain)

Ask Azure to confirm, or check:
- Azure Portal → App Service → **Default domain**

**Step 2: Set VITE_API_URL on Vercel**

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add this variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://ridebuddy-prod.azurewebsites.net/api` | Production |

4. Click **Save**
5. Vercel will **auto-redeploy** (takes 2-3 minutes)

**Step 3: Verify API URL is Being Used**

After Vercel redeploys:

1. Open browser console: **Cmd+Option+J** (Mac) or **Ctrl+Shift+J** (Windows)
2. Look for this message on page load:
```
[API] Using VITE_API_URL: https://ridebuddy-prod.azurewebsites.net/api
```

3. Try signup and check Network tab:
   - Request URL should be: `https://ridebuddy-prod.azurewebsites.net/api/auth/signup` ✅
   - NOT: `/api/auth/signup` (that won't work in production)

**Step 4: Configure Backend CORS**

Backend must allow requests from Vercel domain.

Update `/server/src/app.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',           // Dev
  'http://localhost:5174',           // Dev
  'https://ride-buddy-liart.vercel.app',  // Vercel production
]

// Add from environment if needed
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL)
}
```

Then in Azure environment variables, set:
```
FRONTEND_URL=https://ride-buddy-liart.vercel.app
```

This is **already done** in your code ✅

---

## 📋 Deployment Checklist

### Backend (Azure)

- [ ] Generate secure JWT_SECRET
- [ ] Add JWT_SECRET to Azure environment variables
- [ ] Add MONGO_URI to Azure environment variables
- [ ] Add NODE_ENV=production to Azure
- [ ] Add FRONTEND_URL=https://ride-buddy-liart.vercel.app
- [ ] Restart Azure App Service
- [ ] Verify backend health: `curl https://your-azure-url/api/health`
- [ ] Check startup logs for environment validation

### Frontend (Vercel)

- [ ] Verify `client/vercel.json` exists with rewrites rule
- [ ] Set VITE_API_URL on Vercel dashboard to your Azure backend URL
- [ ] Trigger redeploy (or commit to GitHub)
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Test direct URL: `https://ride-buddy-liart.vercel.app/auth`
- [ ] Test page refresh at /auth route
- [ ] Check browser console for `[API] Using VITE_API_URL: ...`

---

## 🧪 Testing Signup Flow

### Test Locally First (Development)

```bash
# Terminal 1: Start backend
cd server
npm start
# Should print: ✅ All environment variables configured

# Terminal 2: Start frontend
cd client
npm run dev
# Vite server at http://localhost:5173

# Browser:
# 1. Go to http://localhost:5173/auth
# 2. Fill signup form
# 3. Click signup
# Should succeed with 201 and receive JWT token
```

### Test on Production (Vercel + Azure)

```bash
# 1. Open https://ride-buddy-liart.vercel.app/auth
# 2. Open Developer Console (Cmd+Option+J)
# 3. Look for: [API] Using VITE_API_URL: https://your-azure-url/api
# 4. Fill and submit signup form
# 5. Should receive JWT token in response
```

---

## 🔍 Troubleshooting

### Issue: Still getting 404 on refresh

**Cause:** Vercel.json not deployed yet

**Fix:**
```bash
# Make sure vercel.json is committed
git add client/vercel.json
git commit -m "fix: vercel.json SPA routing"
git push origin main
# Wait 2-3 minutes for Vercel redeploy
```

### Issue: "JWT_SECRET is not configured" error

**Cause:** Environment variable not set in Azure

**Fix:**
1. Go to Azure Portal → App Service → Environment variables
2. Add: `JWT_SECRET=your_generated_secret`
3. Save and restart app
4. Check startup logs to verify it loaded

### Issue: "Cannot fetch from undefined" error

**Cause:** VITE_API_URL not set on Vercel

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_URL=https://your-azure-url/api`
3. Save (auto-redeploy)
4. Check browser console after reload

### Issue: CORS error "origin not allowed"

**Cause:** Frontend URL not in backend's CORS origins

**Fix:**
1. In Azure, set: `FRONTEND_URL=https://ride-buddy-liart.vercel.app`
2. Backend reads this and adds it to CORS origins
3. Restart Azure App Service

### Issue: Backend URL is wrong

**Cause:** VITE_API_URL has wrong domain

**Fix:**
1. Find correct Azure URL from Azure Portal
2. Update Vercel environment variable
3. Test: `curl https://azure-url/api/health` should return 200
4. Once confirmed, set in Vercel: `VITE_API_URL=https://azure-url/api`

---

## 📁 File Structure Review

Your codebase should look like this:

```
client/
├── vercel.json ✅ SPA routing config
├── .env.example ✅ Documented
├── src/
│   ├── services/
│   │   └── api.js ✅ Uses VITE_API_URL with logging
│   └── ...
└── ...

server/
├── .env ✅ Has JWT_SECRET
├── .env.example ✅ Documented
├── src/
│   ├── app.js ✅ JWT validation + CORS setup
│   ├── index.js ✅ Env var validation on startup
│   └── ...
└── ...
```

---

## 🚀 Quick Reference Commands

### Generate JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Health
```bash
curl https://your-azure-url/api/health
# Should return: {"success": true, "message": "RideBuddy API is live"}
```

### Test Signup
```bash
curl -X POST https://your-azure-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: https://ride-buddy-liart.vercel.app" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Check Vercel Deployment
```bash
# After pushing to GitHub, check Vercel deployments
# Vercel Dashboard → Deployments
# Should show "Ready" with green checkmark
```

---

## 📝 Environment Variables Summary

### Backend (.env in Azure)
```dotenv
JWT_SECRET=a7f3b2c9e1d4f6a8b2c5e9f3d7a1b4c8e2f5a9d3c7b1e4f8a2c6d9e3f7b1a5
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ridebuddy
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://ride-buddy-liart.vercel.app
```

### Frontend (Environment Variables on Vercel)
```
VITE_API_URL=https://your-azure-url/api
```

---

## ✅ Success Indicators

When everything is configured correctly:

### Backend Startup
```
✅ RideBuddy server running on http://0.0.0.0:5001
✅ Connected to MongoDB
✅ All environment variables configured
```

### Signup Request
```
Request: https://ride-buddy-liart.vercel.app/auth
API Call: https://your-azure-url/api/auth/signup
Response: 201 Created
{
  "success": true,
  "message": "Signup successful",
  "token": "eyJhbGc...",
  "user": { "id": "...", "name": "..." }
}
```

### Browser Console
```
[API] Using VITE_API_URL: https://your-azure-url/api
```

### Direct URL Test
```
https://ride-buddy-liart.vercel.app/auth → 200 ✅ (not 404)
Refresh page → Still shows auth page ✅
```

---

## 🆘 Still Having Issues?

1. **Check all 3 critical issues above** - Most problems fall into these categories
2. **Verify environment variables are set** - Not committed to git, but set in Azure/Vercel dashboards
3. **Check startup logs**:
   - Azure: App Service → Logs → Log stream
   - Vercel: Dashboard → Deployments → Click build → View logs
4. **Test with curl** before testing in browser
5. **Clear browser cache** - Cmd+Shift+Delete

---

## 📞 Quick Help

| Issue | Check This | Fix |
|-------|-----------|-----|
| JWT_SECRET error | Azure env vars | Add `JWT_SECRET` to Azure |
| 404 on /auth | vercel.json exists | Commit and push vercel.json |
| API "undefined" | Vercel env vars | Add `VITE_API_URL` to Vercel |
| CORS error | Backend CORS | Ensure `FRONTEND_URL` in Azure |
| Wrong API URL | Browser console | Check `[API] Using VITE_API_URL:` message |

---

**Version:** 1.0  
**Last Updated:** March 28, 2026  
**Status:** Ready for Production ✅

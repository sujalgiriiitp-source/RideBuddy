# Vercel SPA Routing Fix - Complete Guide

## 🎯 Problem Explained (In Simple Terms)

When you refresh a page or directly visit a route like `/auth`, Vercel returns a 404 error because:

### How It Works Normally:
1. You visit `https://ride-buddy-liart.vercel.app/auth`
2. Vercel looks for a folder/file called `auth` on the server
3. It doesn't find one (because it's a React route, not a real file)
4. Returns: **404 NOT_FOUND** ❌

### What Happens When You Navigate Inside the App:
1. JavaScript Router handles the navigation
2. No page refresh/server request
3. Works fine! ✅

## ✅ Solution: Configure Vercel as a Single Page Application (SPA)

A **Single Page Application (SPA)** means:
- One HTML file (`index.html`)
- JavaScript handles all routing
- Vercel should redirect ALL requests to `index.html`
- React Router takes over and shows the right page

---

## 📄 File 1: Create `vercel.json` (NEW FILE)

**Location:** `/client/vercel.json`

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

### What Each Line Does:

```json
{
  "buildCommand": "npm run build",      // How to build your app
  "outputDirectory": "dist",            // Where Vite outputs the built files
  "devCommand": "vite",                 // Command for local development
  
  "env": {
    "VITE_API_URL": "@vite_api_url",        // Environment variable from Vercel settings
    "VITE_NATIVE_API_URL": "@vite_native_api_url"
  },
  
  "rewrites": [
    {
      "source": "/(.*)",              // Match ALL URLs
      "destination": "/index.html"    // Redirect them to index.html
    }
  ]
}
```

---

## 📄 File 2: Update `vite.config.js` (Optional but Recommended)

**Location:** `/client/vite.config.js`

Current (should work fine):
```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
```

**No changes needed!** Your Vite config is already correct. It:
- ✅ Uses React plugin
- ✅ Outputs to `dist` folder (default)
- ✅ Has API proxy for development

---

## 🔄 How to Deploy After Adding vercel.json

1. **Add the file:**
   ```bash
   # vercel.json is already created at /client/vercel.json
   ```

2. **Commit and push:**
   ```bash
   cd /Users/sujalgiri/RideBuddy2.0
   git add client/vercel.json
   git commit -m "fix: Add vercel.json for SPA routing configuration"
   git push origin main
   ```

3. **Vercel automatically redeploys:**
   - Visit your GitHub repo
   - Vercel sees the new push
   - Automatically rebuilds and deploys
   - Takes ~2-3 minutes

4. **Test the fix:**
   - Go to: `https://ride-buddy-liart.vercel.app/auth`
   - Refresh the page (Ctrl+R or Cmd+R)
   - Should load without 404 ✅
   - All routes should work: `/`, `/auth`, `/home`, etc.

---

## 🔍 Why This Fixes the Issue

### Before (Without vercel.json):
```
User visits: https://ride-buddy-liart.vercel.app/auth
Vercel searches for: /auth folder or file
Not found → 404 Error ❌
```

### After (With vercel.json):
```
User visits: https://ride-buddy-liart.vercel.app/auth
vercel.json rule: "Redirect all URLs to /index.html"
Vercel serves: /index.html ✅
React Router runs in browser
React Router checks the URL: /auth
Renders the auth page ✅
```

---

## ✅ Environment Variables Setup

The vercel.json references environment variables using `@` syntax:

```json
"env": {
  "VITE_API_URL": "@vite_api_url"
}
```

**This means:** On Vercel project settings, set:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-api.com/api` (or Railway/Azure URL) |
| `VITE_NATIVE_API_URL` | `https://your-native-api.com/api` (if using Capacitor) |

### How to Set on Vercel:
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://ridebuddy-production-f5f2.up.railway.app/api`
   - **Environment:** Production
4. Click "Add"
5. Vercel auto-redeploys

---

## 📋 Complete Checklist

- [ ] `vercel.json` created in `/client/` folder
- [ ] Build command is `npm run build`
- [ ] Output directory is `dist`
- [ ] Rewrites rule redirects all routes to `/index.html`
- [ ] Pushed to GitHub
- [ ] Vercel redeployed automatically
- [ ] Environment variables set on Vercel dashboard
- [ ] Test: Visit `/auth` directly → No 404 ✅
- [ ] Test: Refresh page → Still shows auth page ✅
- [ ] Test: Click links in app → Navigation works ✅

---

## 🧪 Testing After Deployment

### Test 1: Direct URL Access
```bash
# Visit these URLs directly (don't click, paste in address bar)
https://ride-buddy-liart.vercel.app/
https://ride-buddy-liart.vercel.app/auth
https://ride-buddy-liart.vercel.app/home
https://ride-buddy-liart.vercel.app/rides

# Expected: All load without 404 ✅
```

### Test 2: Page Refresh
```bash
# Open any route, then refresh (Ctrl+R or Cmd+R)
https://ride-buddy-liart.vercel.app/auth
→ Refresh page
→ Should still show auth page ✅
```

### Test 3: Browser Back/Forward
```bash
# Click links to navigate
# Use back/forward buttons
# Should work smoothly ✅
```

---

## 🐛 Troubleshooting

### Still getting 404?
1. **Check vercel.json exists:** 
   - Verify file at `/client/vercel.json`
   - Verify it's in GitHub (pushed)

2. **Wait for redeploy:**
   - Vercel might still be building
   - Check "Deployments" tab on Vercel dashboard
   - Wait for green checkmark

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

4. **Check build logs:**
   - Vercel dashboard → Deployments → Click latest
   - Check "Build" and "Logs" tabs
   - Look for any errors

### Routes work but styles/images broken?
- Make sure `VITE_API_URL` is set correctly
- Check that all imports use relative paths
- Run `npm run build` locally to verify

---

## 📝 Common Mistakes to Avoid

❌ **Don't:** Put vercel.json in the root folder  
✅ **Do:** Put it in `/client/` folder (same as package.json)

❌ **Don't:** Use wrong output directory  
✅ **Do:** Use `"outputDirectory": "dist"` (Vite default)

❌ **Don't:** Forget to push the file  
✅ **Do:** `git add client/vercel.json && git commit && git push`

❌ **Don't:** Change React Router code  
✅ **Do:** Just add vercel.json (no code changes needed)

---

## 📚 How React Router Works After Fix

With vercel.json in place:

```javascript
// User visits: https://ride-buddy-liart.vercel.app/auth

// Step 1: Vercel redirects to index.html
// (vercel.json rewrites rule)

// Step 2: Browser loads index.html
// All JS files download

// Step 3: React Router initializes
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/auth', element: <AuthPage /> },  // ← React Router matches this!
  { path: '/home', element: <HomePage /> },
])

// Step 4: React Router sees URL is /auth
// Renders AuthPage component ✅
```

---

## ✨ Summary

### What You Did:
Added a single file `vercel.json` with routing configuration

### Why It Works:
Tells Vercel to redirect all requests to `index.html`, letting React Router handle URLs in the browser

### Result:
- ✅ `/auth` loads correctly
- ✅ Page refresh works
- ✅ All routes work
- ✅ No 404 errors

### Deployment:
Push to GitHub → Vercel auto-redeploys → Fixed! 🎉

---

*Last Updated: March 28, 2026*  
*Framework: React 19 + Vite 8 + React Router 7*  
*Hosting: Vercel*  

# RideBuddy - Student Travel Companion Platform

A production-ready, scalable ride-sharing platform for students and Tier-2 cities in India. Built with **React, Node.js, Express, MongoDB, and Capacitor**.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Auth:** JWT + bcryptjs password hashing
- **Validation:** express-validator
- **Mobile:** Capacitor (Android ready)
- **Deployment:** Render (backend) + Vercel (frontend)

## Quick Start

### Local Setup (5 minutes)

```bash
# 1. Install dependencies
npm install --prefix server
npm install --prefix client

# 2. Create .env files
# server/.env
MONGO_URI=mongodb://127.0.0.1:27017/ridebuddy
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173

# client/.env
VITE_API_URL=/api
VITE_PROXY_TARGET=http://localhost:5001
VITE_NATIVE_API_URL=https://your-backend-domain.com/api

# 3. Start MongoDB (macOS)
brew services start mongodb-community

# 4. Run apps in separate terminals
cd server && npm run dev    # Terminal 1
cd client && npm run dev    # Terminal 2

# Visit http://localhost:5173
```

### Features Implemented

✅ User signup/login with JWT auth & secure password hashing  
✅ Protected routes on frontend  
✅ User profile with photo & rating system  
✅ Create, browse, search & filter rides  
✅ Ride details with participants & join requests  
✅ WhatsApp integration (chat + invite links)  
✅ Mobile-first responsive design (Tailwind CSS)  
✅ Loading states, error handling, toast notifications  
✅ Production-ready error handling & auto port fallback  
✅ Full API validation & logging

---

## Backend Setup

From `server` folder:

```bash
npm install
cp .env.example .env
# Edit .env with:
# MONGO_URI=mongodb://127.0.0.1:27017/ridebuddy
# JWT_SECRET=your_secret_key
# PORT=5000
# CLIENT_URL=http://localhost:5173,http://localhost:3000

npm run dev     # Development with auto-reload
npm run start   # Production mode
```

Health check:
```bash
curl http://localhost:5000/api/health
```

## Frontend Setup

From `client` folder:

```bash
npm install
cp .env.example .env
# Edit .env with:
# VITE_API_URL=/api
# VITE_PROXY_TARGET=http://localhost:5001
# VITE_NATIVE_API_URL=https://your-backend-domain.com/api

npm run dev     # Development server at http://localhost:5173
npm run build   # Production build
npm run lint    # Code quality check
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user, returns JWT token

### Users (Protected)
- `GET /users/me` - Get current user profile & ride history
- `PATCH /users/me/photo` - Update profile photo URL
- `POST /users/:id/rate` - Rate a user (1-5 stars)

### Rides
- `GET /rides` - List all rides (optional: `?from=Delhi&to=Gurgaon&date=2024-12-25&vehicle=Car`)
- `POST /rides` (Protected) - Create new ride
- `GET /rides/:id` - Get ride details with join requests
- `POST /rides/:id/join` (Protected) - Request to join ride
- `PATCH /rides/interests/:interestId` (Protected) - Accept/reject join request
- `GET /rides/mine/posted` (Protected) - Get user's posted rides
- `GET /rides/mine/joined` (Protected) - Get user's joined rides

---

## Deployment

### Backend (Render)

1. Push to GitHub
2. Create Render Web Service
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
3. Add env vars in Render:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ridebuddy
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```
4. Copy backend URL: `https://your-backend.onrender.com`

### Frontend (Vercel)

1. Import GitHub repo to Vercel
2. Root Directory: `client`
3. Framework: **Vite**
4. Add env var:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy

### Database (MongoDB Atlas)

1. Create free account at [atlas.mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create cluster M0 (free)
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ridebuddy`
4. Use in Render `.env`

---

## Mobile App (Capacitor Android)

From `client` folder:

```bash
# Capacitor already configured in this project.
# Only add android once (skip if client/android already exists):
# npx cap add android

# Build web app
npm run build

# Sync web assets and config to Android
npm run cap:sync

# Open Android Studio project
npm run cap:android

# Optional: build + sync in one step
npm run android:build

# Optional: run directly on connected Android device/emulator
npm run android:run
```

In Android Studio:
1. Wait for Gradle sync
2. Run on emulator or real device
3. Build APK: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. Locate APK at `client/android/app/build/outputs/apk/debug/app-debug.apk`

**Important (Real Device):**
- Do **not** use `localhost` for API in Android builds.
- Set `VITE_NATIVE_API_URL` to your deployed backend URL before building APK.
- Recommended: `VITE_NATIVE_API_URL=https://your-backend-domain.com/api`

Example native build command:

```bash
cd client
VITE_NATIVE_API_URL=https://your-backend-domain.com/api npm run android:build
```

Install APK on device (with USB debugging):

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Troubleshooting

### Port 5000 Already in Use
Server auto-falls back to next available port (5001, 5002, ...).

### MongoDB Connection Error
Start MongoDB: `brew services start mongodb-community`  
Or use Atlas connection string in `.env`

### CORS Error on Frontend
Update `CLIENT_URL` in server `.env` to include your Vercel domain.

### WhatsApp Links Not Working
Ensure phone numbers include country code: `+919876543210`

---

## Project Stats

- **Lines of Code:** ~2,000 (frontend) + ~1,500 (backend)
- **Components:** 6 main pages + 4 reusable components
- **API Endpoints:** 12 routes with full validation
- **Database Models:** 3 schemas with relationships
- **Build Time:** ~300ms (frontend)
- **Bundle Size:** ~100KB gzipped

---

## License

MIT

---

**Happy Riding! 🚗🏍️**

This rebuilds web assets and syncs them to Android.

---

## Security and Production Notes

- Passwords are hashed with `bcryptjs`.
- JWT token authentication protects private APIs.
- Input validation uses `express-validator`.
- CORS is enabled with allowlist support and mobile-safe origin handling.
- API is configured to run on `process.env.PORT`.

---

## Future Improvements (Optional)

- Cloud image upload for profile photos (Cloudinary/S3)
- OTP-based phone verification
- In-app chat
- Notifications for join-request updates
- Trip completion workflow and richer ratings
# RideBuddy

# 🚀 RideBuddy - Full Stack Setup Guide

Complete step-by-step guide to run both backend and frontend of the RideBuddy application.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB running locally (or connection string for Atlas)
- Git and GitHub account

## 🗂️ Project Structure

```
RideBuddy2.0/
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── app.js         # Express app setup
│   │   ├── index.js       # Server entry point
│   │   ├── config/        # Database config
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utilities
│   ├── package.json       # Dependencies
│   └── .env               # Environment variables
│
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Global state
│   │   ├── services/      # API integration
│   │   └── utils/         # Helpers
│   ├── package.json       # Dependencies
│   ├── .env               # Environment variables
│   └── vite.config.js     # Vite configuration
│
├── API_QUICK_REFERENCE.md # API endpoint documentation
├── PRODUCTION_UPGRADE_SUMMARY.md
└── FULL_STACK_SETUP.md    # This file
```

## 🔧 Backend Setup (Node.js + Express + MongoDB)

### Step 1: Navigate to Server Directory

```bash
cd /Users/sujalgiri/RideBuddy2.0/server
```

### Step 2: Environment Configuration

Create or verify `.env` file:

```bash
# .env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/ridebuddy
JWT_SECRET=your-secret-key-change-in-production
CLIENT_URL=http://localhost:5173
```

**Important**: 
- `MONGO_URI`: Update if using MongoDB Atlas
- `JWT_SECRET`: Use a strong random string in production
- `CLIENT_URL`: Frontend URL for CORS

### Step 3: MongoDB Setup

#### Option A: Local MongoDB

```bash
# macOS - Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongo
# Should show connection info
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ridebuddy
   ```

### Step 4: Install Dependencies

```bash
npm install
```

Expected output: `audited 180 packages`

### Step 5: Start Backend Server

```bash
# Development mode (with hot reload)
npm start

# Or directly
npm run dev
```

**Expected output:**
```
MongoDB connected successfully with all indexes
RideBuddy server running on http://0.0.0.0:5001
Startup config: NODE_ENV=development PORT=5001
```

### Step 6: Verify Backend is Running

```bash
# In another terminal
curl http://localhost:5001/api/health
# Expected response: {"success":true,"message":"RideBuddy API is live"}
```

---

## 🎨 Frontend Setup (React + Vite + Tailwind)

### Step 1: Navigate to Client Directory

```bash
cd /Users/sujalgiri/RideBuddy2.0/client
```

### Step 2: Environment Configuration

Create or verify `.env` file:

```bash
# .env
VITE_API_URL=http://localhost:5001/api
VITE_PROXY_TARGET=http://localhost:5001
```

### Step 3: Install Dependencies

```bash
npm install
```

Expected output: `audited 323 packages`

### Step 4: Start Frontend Dev Server

```bash
# Start Vite dev server
npm run dev
```

**Expected output:**
```
VITE v8.0.2  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Open in Browser

```bash
# Open this URL in your browser
http://localhost:5173
```

---

## 📱 Testing the Full Application

### Test 1: Authentication Flow

1. Open `http://localhost:5173/auth`
2. Click **Signup** tab
3. Enter:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `1234567890`
   - Password: `password123`
4. Click **Create Account**
5. ✅ Should redirect to home page
6. ✅ See "Welcome John Doe!" in navbar

### Test 2: Create a Ride

1. Click **Offer** in navigation
2. Fill form:
   - From: `Patna`
   - To: `Delhi`
   - Date: `2026-04-15`
   - Time: `09:00`
   - Vehicle: `Car`
   - Seats: `4`
   - Notes: `Highway tolls paid`
3. Click **Post Ride**
4. ✅ Should redirect to ride details page
5. ✅ See success toast notification

### Test 3: Find and Join Rides

1. Click **Find** in navigation
2. Enter filter:
   - From: `Patna`
   - Click **Search**
3. ✅ Should show available rides
4. Click on a ride card
5. ✅ See ride details
6. Click **Join Request** (if not owner)
7. ✅ See success message

### Test 4: Profile Page

1. Click **Profile** in navigation
2. ✅ See user info (name, email, phone, rating)
3. ✅ See "Rides Posted" section
4. ✅ See "Ride History" section

### Test 5: Search Filters

Go to Find Rides page:
- **By Location**: Enter "Delhi" in "To" field
- **By Date**: Select future date
- **By Vehicle**: Select "Bike"
- **Pagination**: Scroll to bottom
- ✅ All filters should work and update ride list

---

## 🔐 Using the API

### Option 1: Browser DevTools

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Make requests in the app
4. See API calls: `POST /api/auth/login`, `GET /api/rides`, etc.
5. Click request → see headers and payload

### Option 2: Command Line (curl)

#### Register/Login

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secure123"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "secure123"
  }'

# Save token from response
TOKEN="your_jwt_token_here"
```

#### Browse Rides

```bash
# Get all rides
curl http://localhost:5001/api/rides

# Get with filters
curl "http://localhost:5001/api/rides?from=Patna&to=Delhi&page=1&limit=10"

# Get specific ride
curl http://localhost:5001/api/rides/ride-id-here
```

#### Authenticated Requests

```bash
# Create ride (requires auth)
curl -X POST http://localhost:5001/api/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "from": "Patna",
    "to": "Gaya",
    "date": "2026-04-20",
    "seats": 3,
    "vehicle": "Car"
  }'

# Join ride
curl -X POST http://localhost:5001/api/rides/ride-id/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": ""}'

# Get profile
curl http://localhost:5001/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔗 API Endpoints Summary

### Authentication (No Auth Required)
```
POST   /api/auth/register     - Create new account
POST   /api/auth/login        - Login with credentials
POST   /api/auth/logout       - Logout
```

### Rides (Auth Required for write operations)
```
GET    /api/rides             - List all rides (with pagination & filters)
POST   /api/rides             - Create new ride
GET    /api/rides/:id         - Get ride details
POST   /api/rides/:id/join    - Join a ride
```

### Users (Auth Required)
```
GET    /api/users/me          - Get my profile
PATCH  /api/users/me/photo    - Update profile photo
POST   /api/users/:id/rate    - Rate a user
```

For full API documentation, see [API_QUICK_REFERENCE.md](../API_QUICK_REFERENCE.md).

---

## 🐛 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Kill process on port 5001
kill -9 $(lsof -t -i:5001)

# Or change PORT in .env
PORT=5002
```

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
ps aux | grep mongo

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongo
```

#### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

#### Vite Dev Server Won't Start
```bash
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

#### API Calls Getting 401 (Unauthorized)
1. Check token in browser DevTools: `localStorage.ridebuddy_token`
2. Verify token format: `Authorization: Bearer <token>`
3. Check if backend CORS is configured correctly

#### CORS Errors
Update `.env` in server:
```
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
```

#### Blank Page / Not Loading
1. Open browser DevTools (F12)
2. Check Console for JavaScript errors
3. Check Network tab for failed requests
4. Verify API URL: Should be `http://localhost:5001/api`

---

## 📊 Development Workflow

### Terminal Setup (Recommended)

Open 3 terminals:

**Terminal 1 - Backend**
```bash
cd server
npm start
# Listens on http://localhost:5001
```

**Terminal 2 - Frontend**
```bash
cd client
npm run dev
# Listens on http://localhost:5173
```

**Terminal 3 - Testing/Utils**
```bash
# Use for curl commands, git, etc.
cd /Users/sujalgiri/RideBuddy2.0
git status
```

### IDE Setup (VS Code Recommended)

1. Open project root: `File > Open Folder > RideBuddy2.0`
2. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Thunder Client (API testing)
3. Create `.vscode/settings.json`:
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "[javascript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
   }
   ```

---

## 🚀 Production Deployment

### Backend Deployment (Railway.app)

1. Push to GitHub (already done ✅)
2. Go to [Railway.app](https://railway.app)
3. Create new project → Connect GitHub repo
4. Set environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   MONGO_URI=your-atlas-uri
   JWT_SECRET=strong-random-secret
   CLIENT_URL=your-frontend-url
   ```
5. Deploy button → done!

### Frontend Deployment (Vercel)

```bash
# Build production version
npm run build

# Deploy to Vercel
npm i -g vercel
vercel
```

Update `.env.production`:
```
VITE_API_URL=https://your-api.railway.app/api
```

---

## 📝 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String (optional, unique, sparse),
  profilePhoto: String,
  rating: { sum: Number, count: Number },
  createdAt: Date,
  updatedAt: Date
}
```

### Ride Model
```javascript
{
  from: String,
  to: String,
  date: Date,
  time: String (HH:MM),
  vehicle: String (Bike|Car),
  seats: Number,
  availableSeats: Number,
  notes: String,
  createdBy: ObjectId (User),
  passengers: [ObjectId] (Users),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Next Steps

### After Initial Setup

1. **Test thoroughly**: All user flows work correctly
2. **Add features**: 
   - Push notifications
   - Real-time messaging
   - Payment integration
   - Reviews/ratings
3. **Optimize**:
   - Add caching (Redis)
   - Implement pagination UI
   - Add search analytics
4. **Deploy**: Push to production

### Code Quality

```bash
# Backend linting
cd server
npm run lint

# Frontend linting
cd client
npm run lint
```

---

## 📚 Documentation Files

- **API_QUICK_REFERENCE.md** - All API endpoints with examples
- **PRODUCTION_UPGRADE_SUMMARY.md** - Backend security & optimization details
- **client/README.md** - Frontend documentation
- **server/README.md** - Backend documentation (if exists)

---

## 🤝 Team Collaboration

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
```

### Environment Files (Git)

**Never commit `.env` files!** Already in `.gitignore`

Share `.env.example` instead:
```
VITE_API_URL=http://localhost:5001/api
```

---

## 📞 Support & Questions

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Cannot connect to backend | Check VITE_API_URL, ensure server is running |
| 401 Unauthorized errors | Verify JWT token in localStorage |
| CORS errors | Update CLIENT_URL in server/.env |
| MongoDB connection fails | Check MONGO_URI, ensure MongoDB is running |
| Port already in use | Kill process or change PORT |

### Debug Mode

Enable verbose logging in browser:
```javascript
// In browser console
localStorage.setItem('debug', '*')
```

---

## ✅ Checklist for Production

- [ ] Backend deployed to production
- [ ] Frontend deployed to production
- [ ] Environment variables updated
- [ ] MongoDB Atlas cluster secured
- [ ] JWT_SECRET changed to strong value
- [ ] CORS properly configured
- [ ] SSL/HTTPS enabled
- [ ] API rate limiting tested
- [ ] Error handling comprehensive
- [ ] Logging in place
- [ ] Monitoring setup
- [ ] Backups configured

---

## 🎉 Success!

You now have a fully functional ride-sharing application:

✅ **Backend**: Secure, validated, logged, production-ready  
✅ **Frontend**: Modern, responsive, fully integrated  
✅ **Database**: Optimized with indexes, migrations  
✅ **Authentication**: JWT with token persistence  
✅ **API Integration**: All endpoints connected  
✅ **Error Handling**: Comprehensive with user feedback  
✅ **Styling**: Tailwind CSS with responsive design  

**Start using RideBuddy now!** 🚀

---

## 📄 License

MIT - Feel free to use for personal and commercial projects.

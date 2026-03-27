# RideBuddy Frontend

Modern React + Tailwind CSS + Vite frontend for the RideBuddy student ride-sharing platform.

## 🚀 Features

- **Authentication**: Register, Login, Logout with JWT token storage
- **Dashboard**: Browse all available rides with real-time updates
- **Search & Filter**: Find rides by location, date, and vehicle type
- **Create Rides**: Post new ride offerings
- **Join Rides**: Request to join available rides
- **My Rides**: View posted and joined rides history
- **User Profile**: Manage profile, view ratings, update profile photo
- **Responsive Design**: Mobile-first UI with desktop support
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Comprehensive error messages and toast notifications
- **Real-time Updates**: Automatic sync with backend

## 🛠️ Tech Stack

- **React 19**: Modern UI library with hooks
- **Vite 8**: Lightning-fast build tool and dev server
- **Tailwind CSS 3**: Utility-first styling framework
- **Axios**: HTTP client with request/response interceptors
- **React Router 7**: Client-side routing and navigation
- **React Hot Toast**: Beautiful toast notifications
- **Capacitor 7**: Native mobile support (Android/iOS)

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Navbar.jsx          # Top header + mobile bottom nav
│   ├── RideCard.jsx        # Ride listing card component
│   ├── RideCardSkeleton.jsx # Loading skeleton
│   ├── LoadingSpinner.jsx   # Full-screen loader
│   ├── ErrorBanner.jsx      # Error message display
│   └── ProtectedRoute.jsx   # Route protection wrapper
├── pages/                   # Full page components
│   ├── HomePage.jsx        # Dashboard/home with recent rides
│   ├── FindRidePage.jsx    # Search rides with filters
│   ├── OfferRidePage.jsx   # Create/post a ride form
│   ├── RideDetailsPage.jsx # Single ride view & join
│   ├── ProfilePage.jsx     # User profile & ride history
│   └── AuthPage.jsx        # Login & signup forms
├── context/                 # Global state (React Context)
│   └── AuthContext.jsx      # Auth state, user, token management
├── services/               # API integration layer
│   └── api.js             # Axios instance with interceptors
├── utils/                  # Helper functions
│   └── date.js            # Date formatting utilities
├── App.jsx                 # Main app component with routes
├── main.jsx                # React DOM entry point
└── index.css              # Global styles + Tailwind
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend running on `http://localhost:5001`

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (if needed)
cp .env.example .env

# 3. Verify VITE_API_URL points to your backend
# Default: http://localhost:5001/api
```

### Development Server

```bash
# Start Vite dev server with hot reload
npm run dev

# Open http://localhost:5173 in browser
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🔧 Environment Configuration

Create `.env` in client root directory:

```env
# Web development
VITE_API_URL=http://localhost:5001/api
VITE_PROXY_TARGET=http://localhost:5001

# Production / Native apps
VITE_NATIVE_API_URL=https://your-production-api.com/api
```

## 📱 Application Routes

| Route | Component | Auth Required | Purpose |
|-------|-----------|---------------|---------|
| `/` | HomePage | ✅ | Dashboard with recent rides |
| `/find` | FindRidePage | ✅ | Search and browse available rides |
| `/offer` | OfferRidePage | ✅ | Create and post a new ride |
| `/rides/:id` | RideDetailsPage | ✅ | View ride details and join |
| `/profile` | ProfilePage | ✅ | User profile, history, and settings |
| `/auth` | AuthPage | ❌ | Login and signup page |

## 🔐 Authentication

### Login/Signup Flow

1. User navigates to `/auth`
2. Enters email/password (signup requires name + phone)
3. Backend validates and returns JWT token
4. Token stored in `localStorage` key: `ridebuddy_token`
5. AuthContext updated with user data
6. User redirected to home (`/`)
7. Protected routes now accessible

### Token Handling

- **Storage**: `localStorage.ridebuddy_token`
- **Interceptor**: Auto-adds `Authorization: Bearer <token>` to all requests
- **Persistence**: Token survives page reloads
- **Validation**: Invalid tokens trigger auto-logout

```javascript
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />
  }
  
  return <div>Welcome {user.name}!</div>
}
```

## 🎨 UI Components

### Navbar
- Desktop header + mobile bottom navigation
- Auto-hides for unauthenticated users
- Active route highlighting
- Logout button

### RideCard
Displays:
- From/To locations
- Date and time
- Vehicle type and available seats
- Driver name and rating
- WhatsApp contact link
- Join button (smart validation)

### LoadingSpinner
- Centered full-screen loader
- Optional loading message
- Smooth fade animations

### ErrorBanner
- Inline error message display
- Dismissible option
- Conditional rendering

### ProtectedRoute
- Redirects unauthenticated users to `/auth`
- Shows loading state during bootstrap
- Prevents flash of unauthorized content

## 📡 API Integration

### Using the API

```javascript
import { api } from '../services/api'

// Simple GET
const response = await api.get('/rides')

// With query parameters
const response = await api.get('/rides', {
  params: { from: 'Patna', to: 'Delhi', page: 1 }
})

// POST with data
const response = await api.post('/rides', {
  from: 'Patna',
  to: 'Delhi',
  date: '2026-04-15',
  seats: 4
})

// Error handling
try {
  await api.post('/auth/login', { email, password })
} catch (error) {
  const message = error.response?.data?.message || 'Error'
  console.error(message)
}
```

### Request Interceptors

Automatically adds JWT token to all requests:

```javascript
// Before sending request:
Authorization: Bearer <token_from_localStorage>
```

### Error Handling

```javascript
import { getErrorMessage } from '../services/api'

try {
  await api.post('/rides', data)
} catch (error) {
  const message = getErrorMessage(error, 'Failed to create ride')
  toast.error(message)
}
```

## 🎯 Global State (AuthContext)

```javascript
{
  // State
  user: {                 // Logged-in user object
    _id: string,
    name: string,
    email: string,
    phone: string,
    profilePhoto: string,
    averageRating: number,
    rating: { sum, count }
  },
  token: string,          // JWT token
  isAuthenticated: bool,  // Token exists
  isBootstrapping: bool,  // Loading on app init
  
  // Methods
  signup(payload),        // Register new user
  login(payload),         // Login with credentials
  logout(),               // Clear session
  refreshProfile(),       // Fetch latest user data
}
```

## 🎨 Tailwind Customization

### Custom Colors

Brand color palette (`tailwind.config.js`):

```javascript
brand: {
  50: '#eff9ff',   // Very light blue
  100: '#dff2ff',  // Light blue
  500: '#0ea5e9',  // Bright blue
  600: '#0284c7',  // Primary blue
  700: '#0369a1',  // Dark blue
  900: '#0c4a6e',  // Very dark blue
}
```

### Component Classes (`index.css`)

```css
.page-title         /* Page headings (20px/24px bold) */
.section-card       /* White cards with border & shadow */
.input-field        /* Rounded input fields */
.primary-btn        /* Blue primary buttons */
.secondary-btn      /* Light secondary buttons */
.dark-btn           /* Dark/danger buttons */
.chip               /* Small badge components */
```

## 📊 Data Flow Example

```
User clicks "Find Ride"
    ↓
<input onChange /> updates filter state
    ↓
User submits form
    ↓
handleSearch() calls api.get('/rides', { params })
    ↓
Axios adds Authorization header automatically
    ↓
Backend validates & returns rides
    ↓
setRides() updates component state
    ↓
Component re-renders with new ride list
    ↓
Toast shows success
```

## 🔄 Common Patterns

### Fetching Data with Loading State

```javascript
const [data, setData] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint')
      setData(response.data.items)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }
  
  fetchData()
}, [])

return isLoading ? <LoadingSpinner /> : error ? <ErrorBanner /> : <div>{data}</div>
```

### Form Submission with Validation

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  try {
    const response = await api.post('/endpoint', formData)
    toast.success('Success!')
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    setIsSubmitting(false)
  }
}
```

### Protected Component Access

```javascript
import { useAuth } from '../context/AuthContext'

function PrivateFeature() {
  const { user, isAuthenticated } = useAuth()
  
  return (
    <button disabled={!isAuthenticated || user._id !== rideOwnerId}>
      Join Ride
    </button>
  )
}
```

## 📝 Adding Features

### Add a New Page

1. Create `src/pages/YourPage.jsx`
2. Add route in `App.jsx`:
   ```jsx
   <Route path="/your-page" element={<ProtectedRoute><YourPage /></ProtectedRoute>} />
   ```
3. Add nav link in `Navbar.jsx`

### Add a New Component

1. Create `src/components/YourComponent.jsx`
2. Export and import where needed
3. Style with Tailwind classes

### Integrate New API Endpoint

```javascript
// In your component
import { api, getErrorMessage } from '../services/api'

const response = await api.get('/new-endpoint', { params })
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Update `.env.production` with production API URL.

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=https://api.yourdomain.com/api
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🐛 Troubleshooting

### "Cannot find module 'axios'"

```bash
npm install axios
```

### API calls returning 401

- Check token in localStorage: `localStorage.getItem('ridebuddy_token')`
- Verify token is valid and not expired
- Check backend CORS settings

### Vite dev server won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Image not loading

Use placeholder: `https://placehold.co/80x80`

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Docs](https://axios-http.com)
- [React Router](https://reactrouter.com)

## 📞 Backend Integration

See parent directory `README.md` and `API_QUICK_REFERENCE.md` for backend details.

## 📄 License

MIT

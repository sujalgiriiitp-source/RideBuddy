import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import FindRidePage from './pages/FindRidePage'
import HomePage from './pages/HomePage'
import OfferRidePage from './pages/OfferRidePage'
import ProfilePage from './pages/ProfilePage'
import RideDetailsPage from './pages/RideDetailsPage'

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-20 md:pb-8">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-5 md:py-6">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find"
            element={
              <ProtectedRoute>
                <FindRidePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer"
            element={
              <ProtectedRoute>
                <OfferRidePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides/:id"
            element={
              <ProtectedRoute>
                <RideDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '14px',
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

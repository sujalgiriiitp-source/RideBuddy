import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

const initialSignupState = { name: '', email: '', phone: '', password: '' }
const initialLoginState = { email: '', password: '' }

const AuthPage = () => {
  const { isAuthenticated, login, signup } = useAuth()
  const [tab, setTab] = useState('login')
  const [signupForm, setSignupForm] = useState(initialSignupState)
  const [loginForm, setLoginForm] = useState(initialLoginState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await signup(signupForm)
      toast.success('Welcome to RideBuddy!')
    } catch (error) {
      const message = getErrorMessage(error, 'Signup failed')
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await login(loginForm)
      toast.success('Logged in successfully')
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed')
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">RideBuddy</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mb-5 text-sm text-slate-600">Student Travel Companion Platform</p>

        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            className={`rounded-lg py-2 text-sm font-semibold transition ${tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`rounded-lg py-2 text-sm font-semibold transition ${tab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            onClick={() => setTab('signup')}
          >
            Signup
          </button>
        </div>

        <ErrorBanner message={errorMessage} className="mb-4" />

        {tab === 'login' ? (
          <form className="space-y-3" onSubmit={handleLogin}>
            <input
              className="input-field"
              placeholder="Email"
              type="email"
              value={loginForm.email}
              onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <input
              className="input-field"
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
            <button
              disabled={isSubmitting}
              className="dark-btn w-full"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={handleSignup}>
            <input
              className="input-field"
              placeholder="Full Name"
              value={signupForm.name}
              onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <input
              className="input-field"
              placeholder="Email"
              type="email"
              value={signupForm.email}
              onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <input
              className="input-field"
              placeholder="Phone (with country code)"
              value={signupForm.phone}
              onChange={(event) => setSignupForm((prev) => ({ ...prev, phone: event.target.value }))}
              required
            />
            <input
              className="input-field"
              placeholder="Password"
              type="password"
              value={signupForm.password}
              onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
            <button
              disabled={isSubmitting}
              className="primary-btn w-full"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthPage

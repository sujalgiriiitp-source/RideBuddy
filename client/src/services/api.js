import axios from 'axios'
import { Capacitor } from '@capacitor/core'

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

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable credentials (cookies, authorization headers)
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ridebuddy_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle 401 responses by clearing token and redirecting to auth
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

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  
  // If there's a message, use it
  if (data?.message) {
    // If there are validation errors, append them
    if (data?.errors && typeof data.errors === 'object') {
      const errorsList = Object.entries(data.errors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ')
      return `${data.message} - ${errorsList}`
    }
    return data.message
  }
  
  // If only validation errors (no message)
  if (data?.errors && typeof data.errors === 'object') {
    return Object.entries(data.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(', ')
  }
  
  // Network error
  if (error?.message === 'Network Error') {
    return 'Network error - please check your connection'
  }
  
  // Generic fallback
  return fallback
}

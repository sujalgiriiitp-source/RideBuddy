import axios from 'axios'
import { Capacitor } from '@capacitor/core'

const resolveApiBaseUrl = () => {
  const webApiUrl = import.meta.env.VITE_API_URL?.trim()
  const nativeApiUrl = import.meta.env.VITE_NATIVE_API_URL?.trim()
  const isNativePlatform = Capacitor.isNativePlatform()

  if (!isNativePlatform) {
    return webApiUrl || '/api'
  }

  if (nativeApiUrl) {
    return nativeApiUrl
  }

  if (webApiUrl && !webApiUrl.startsWith('/api') && !webApiUrl.includes('localhost')) {
    return webApiUrl
  }

  return 'https://your-backend-domain.com/api'
}

const API_BASE_URL = resolveApiBaseUrl()

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ridebuddy_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  return error?.response?.data?.message || fallback
}

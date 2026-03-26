import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getErrorMessage } from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'ridebuddy_token'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null)
        setIsBootstrapping(false)
        return
      }

      try {
        const response = await api.get('/users/me')
        setUser(response.data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setIsBootstrapping(false)
      }
    }

    fetchCurrentUser()
  }, [token])

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }

  const signup = useCallback(async (payload) => {
    const response = await api.post('/auth/signup', payload)
    persistAuth(response.data.token, response.data.user)
    return response.data
  }, [])

  const login = useCallback(async (payload) => {
    const response = await api.post('/auth/login', payload)
    persistAuth(response.data.token, response.data.user)
    return response.data
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.get('/users/me')
      setUser(response.data.user)
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to fetch profile'))
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore network/logout endpoint errors and clear local session anyway.
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      signup,
      login,
      logout,
      refreshProfile,
    }),
    [user, token, isBootstrapping, signup, login, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

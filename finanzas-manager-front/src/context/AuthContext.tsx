import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import client from '../api/client'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'fm_token'

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  const login = useCallback((newToken: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken)
    } catch {
      /* no-op */
    }
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    client.post('/auth/logout').catch(() => {}).finally(() => {
      try {
        localStorage.removeItem(TOKEN_KEY)
      } catch {
        /* no-op */
      }
      setToken(null)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'fm_token'
const MOCK_AUTH = true
const MOCK_TOKEN = 'mock-token'

function readToken(): string | null {
  if (MOCK_AUTH) return MOCK_TOKEN
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
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* no-op */
    }
    setToken(null)
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

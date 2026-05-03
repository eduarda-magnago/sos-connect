import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../services/api'

interface User {
  _id: string
  name: string
  email: string
  role: string
  skills: string[]
}

interface AuthContextData {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role?: string
  skills?: string[]
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('@sos-connect:token')
    const storedUser = localStorage.getItem('@sos-connect:user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    const { user, token } = response.data

    localStorage.setItem('@sos-connect:token', token)
    localStorage.setItem('@sos-connect:user', JSON.stringify(user))

    setUser(user)
    setToken(token)
  }

  async function register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    const { user, token } = response.data

    localStorage.setItem('@sos-connect:token', token)
    localStorage.setItem('@sos-connect:user', JSON.stringify(user))

    setUser(user)
    setToken(token)
  }

  function logout() {
    localStorage.removeItem('@sos-connect:token')
    localStorage.removeItem('@sos-connect:user')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
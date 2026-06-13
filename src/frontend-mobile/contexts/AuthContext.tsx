import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'
import api from '../services/api'

interface User {
  _id: string
  name: string
  email: string
  role: string
  skills: string[]
  avatar?: string
}

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  updateUser: (user: User) => Promise<void>
  logout: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role?: string
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStoredData() {
      const token      = await SecureStore.getItemAsync('sos-token')
      const storedUser = await SecureStore.getItemAsync('sos-user')
      if (token && storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }
    loadStoredData()
  }, [])

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    const { user, token } = response.data
    await SecureStore.setItemAsync('sos-token', token)
    await SecureStore.setItemAsync('sos-user', JSON.stringify(user))
    setUser(user)
  }

  async function register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    const { user, token } = response.data
    await SecureStore.setItemAsync('sos-token', token)
    await SecureStore.setItemAsync('sos-user', JSON.stringify(user))
    setUser(user)
  }

  async function updateUser(user: User) {
    await SecureStore.setItemAsync('sos-user', JSON.stringify(user))
    setUser(user)
  }

  async function logout() {
    await SecureStore.deleteItemAsync('sos-token')
    await SecureStore.deleteItemAsync('sos-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      updateUser,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

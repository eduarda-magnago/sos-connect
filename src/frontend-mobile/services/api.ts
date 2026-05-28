import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'https://sos-connect-api.onrender.com/api',
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('sos-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
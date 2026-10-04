import axios from 'axios'

const TOKEN_KEY = 'fm_token'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
})

client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    /* no-op */
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem(TOKEN_KEY)
      } catch {
        /* no-op */
      }
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default client

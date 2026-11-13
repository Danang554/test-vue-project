import axios from 'axios'

// Helper untuk membaca Backend URL dinamis dari .env
export const getBackendUrl = () => {
  return (
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8080'
  )
}

// Helper untuk membaca hostname/domain target backend
export const getBackendHost = () => {
  try {
    const url = new URL(getBackendUrl())
    return url.host || getBackendUrl()
  } catch {
    return getBackendUrl().replace(/^https?:\/\//, '')
  }
}

// Menentukan baseURL Axios:
// - Jika VITE_API_BASE_URL diisi secara eksplisit, gunakan URL tersebut (misal akses direct ke external domain).
// - Jika kosong, gunakan relative path '' agar request diarahkan ke proxy FE (Vite dev server / Nginx reverse proxy),
//   sehingga bebas CORS dan kompatibel di dalam maupun di luar Docker Desktop.
const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  return ''
}

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor: Format error responses and handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server error details
    const res = error.response
    let message = 'Network or server error'
    let validationErrors = null

    if (res && res.data) {
      message = res.data.message || message
      validationErrors = res.data.errors || null
    } else if (error.message) {
      message = error.message
    }

    // Auto logout on 401 if token expired or invalid (except when calling login/register)
    if (res && res.status === 401) {
      const isAuthEndpoint =
        error.config.url.includes('/api/auth/login') ||
        error.config.url.includes('/api/auth/register')

      if (!isAuthEndpoint) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }
    }

    // Attach custom properties to error for easier consumption
    error.displayMessage = message
    error.validationErrors = validationErrors

    return Promise.reject(error)
  },
)

export default apiClient

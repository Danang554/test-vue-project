import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
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

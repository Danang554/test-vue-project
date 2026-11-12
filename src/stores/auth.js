import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { profileApi } from '@/api/profile'
import { useToastStore } from './toast'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToastStore()

  // Load initial state from localStorage
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => !!user.value?.is_admin)

  // Sync token & user to localStorage
  function setSession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  function clearSession() {
    setSession('', null)
  }

  async function login(credentials) {
    loading.value = true
    try {
      const res = await authApi.login(credentials)
      const data = res.data.data
      setSession(data.token, data.user)
      toast.success(res.data.message || 'Login successful! Welcome back.')
      return { success: true, data }
    } catch (err) {
      toast.error(err.displayMessage || 'Login failed', 'Authentication Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    try {
      const res = await authApi.register(payload)
      toast.success(res.data.message || 'Registration successful! You can now login.')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Registration failed', 'Registration Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch {
      // Ignore logout backend errors (e.g. already revoked)
    } finally {
      clearSession()
      loading.value = false
      toast.info('You have been logged out.')
    }
  }

  async function fetchProfile() {
    if (!token.value) return null
    try {
      const res = await profileApi.getProfile()
      user.value = res.data.data
      localStorage.setItem('user', JSON.stringify(user.value))
      return user.value
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession()
      }
      return null
    }
  }

  async function updateProfile(payload) {
    loading.value = true
    try {
      const res = await profileApi.updateProfile(payload)
      user.value = res.data.data
      localStorage.setItem('user', JSON.stringify(user.value))
      toast.success(res.data.message || 'Profile updated successfully!')
      return { success: true, data: user.value }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to update profile', 'Profile Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  // Setup listener for auto-logout when token expires
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:expired', () => {
      clearSession()
      toast.warning('Your session has expired. Please log in again.')
    })
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearSession,
  }
})

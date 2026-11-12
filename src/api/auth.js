import apiClient from './client'

export const authApi = {
  register(data) {
    return apiClient.post('/api/auth/register', data)
  },
  login(data) {
    return apiClient.post('/api/auth/login', data)
  },
  logout() {
    return apiClient.post('/api/auth/logout')
  },
}

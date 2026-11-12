import apiClient from './client'

export const profileApi = {
  getProfile() {
    return apiClient.get('/api/profile')
  },
  updateProfile(data) {
    return apiClient.patch('/api/profile', data)
  },
}

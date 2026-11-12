import apiClient from './client'

export const healthApi = {
  checkHealth() {
    return apiClient.get('/health')
  },
}

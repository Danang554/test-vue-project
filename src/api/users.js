import apiClient from './client'

export const usersApi = {
  getUsers(params = {}) {
    return apiClient.get('/api/user', { params })
  },
  getUserById(id) {
    return apiClient.get(`/api/user/${id}`)
  },
  createUser(data) {
    return apiClient.post('/api/user', data)
  },
  updateUser(id, data) {
    return apiClient.patch(`/api/user/${id}`, data)
  },
  deleteUser(id) {
    return apiClient.delete(`/api/user/${id}`)
  },
  getDeletedUsers(params = {}) {
    return apiClient.get('/api/user/deleted', { params })
  },
  restoreUser(id) {
    return apiClient.patch(`/api/user/${id}/restore`)
  },
  permanentDeleteUser(id) {
    return apiClient.delete(`/api/user/${id}/permanent`)
  },
}

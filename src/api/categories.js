import apiClient from './client'

export const categoriesApi = {
  getCategories(params = {}) {
    return apiClient.get('/api/category', { params })
  },
  getCategoryById(id) {
    return apiClient.get(`/api/category/${id}`)
  },
  createCategory(data) {
    return apiClient.post('/api/category', data)
  },
  updateCategory(id, data) {
    return apiClient.patch(`/api/category/${id}`, data)
  },
  deleteCategory(id) {
    return apiClient.delete(`/api/category/${id}`)
  },
  getDeletedCategories(params = {}) {
    return apiClient.get('/api/category/deleted', { params })
  },
  restoreCategory(id) {
    return apiClient.patch(`/api/category/${id}/restore`)
  },
  permanentDeleteCategory(id) {
    return apiClient.delete(`/api/category/${id}/permanent`)
  },
}

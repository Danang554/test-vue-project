import apiClient from './client'

export const todosApi = {
  getTodos(params = {}) {
    return apiClient.get('/api/todo', { params })
  },
  getTodoById(id) {
    return apiClient.get(`/api/todo/${id}`)
  },
  createTodo(data) {
    return apiClient.post('/api/todo', data)
  },
  updateTodo(id, data) {
    return apiClient.patch(`/api/todo/${id}`, data)
  },
  toggleComplete(id) {
    return apiClient.patch(`/api/todo/${id}/complete`)
  },
  deleteTodo(id) {
    return apiClient.delete(`/api/todo/${id}`)
  },
  getDeletedTodos(params = {}) {
    return apiClient.get('/api/todo/deleted', { params })
  },
  restoreTodo(id) {
    return apiClient.patch(`/api/todo/${id}/restore`)
  },
  permanentDeleteTodo(id) {
    return apiClient.delete(`/api/todo/${id}/permanent`)
  },
}

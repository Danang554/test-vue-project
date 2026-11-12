import { defineStore } from 'pinia'
import { ref } from 'vue'
import { todosApi } from '@/api/todos'
import { useToastStore } from './toast'

export const useTodoStore = defineStore('todo', () => {
  const toast = useToastStore()

  const todos = ref([])
  const pagination = ref({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const deletedTodos = ref([])
  const deletedPagination = ref({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const currentTodo = ref(null)
  const loading = ref(false)

  const filters = ref({
    search: '',
    categoryId: null, // null = all, number = specific
    isCompleted: null, // null = all, true = completed, false = active
  })

  async function fetchTodos(customParams = {}) {
    loading.value = true
    try {
      const params = {
        page: customParams.page || pagination.value.page || 1,
        limit: customParams.limit || pagination.value.limit || 10,
        ...customParams,
      }

      if (filters.value.search) params.search = filters.value.search
      if (filters.value.categoryId !== null && filters.value.categoryId !== undefined && filters.value.categoryId !== '') {
        params.category_id = filters.value.categoryId
      }
      if (filters.value.isCompleted !== null && filters.value.isCompleted !== undefined && filters.value.isCompleted !== '') {
        params.is_completed = filters.value.isCompleted
      }

      const res = await todosApi.getTodos(params)
      todos.value = res.data.data || []
      if (res.data.pagination) {
        pagination.value = res.data.pagination
      }
      return todos.value
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to fetch todos')
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchTodoById(id) {
    loading.value = true
    try {
      const res = await todosApi.getTodoById(id)
      currentTodo.value = res.data.data
      return currentTodo.value
    } catch (err) {
      toast.error(err.displayMessage || `Failed to fetch todo #${id}`)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createTodo(payload) {
    loading.value = true
    try {
      const res = await todosApi.createTodo(payload)
      toast.success(res.data.message || 'Todo created successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to create todo', 'Validation Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id, payload) {
    loading.value = true
    try {
      const res = await todosApi.updateTodo(id, payload)
      toast.success(res.data.message || 'Todo updated successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to update todo', 'Validation Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function toggleComplete(id) {
    try {
      const res = await todosApi.toggleComplete(id)
      // Optimistically or reactively update item in list
      const updated = res.data.data
      const idx = todos.value.findIndex((t) => t.id === id)
      if (idx !== -1) {
        todos.value[idx] = { ...todos.value[idx], is_completed: updated.is_completed }
      }
      toast.success(res.data.message || 'Todo status updated')
      return { success: true, data: updated }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to toggle status')
      return { success: false, error: err }
    }
  }

  async function deleteTodo(id) {
    loading.value = true
    try {
      const res = await todosApi.deleteTodo(id)
      toast.success(res.data.message || 'Todo moved to trash')
      return { success: true }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to delete todo')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function fetchDeletedTodos(params = { page: 1, limit: 10, search: '' }) {
    loading.value = true
    try {
      const res = await todosApi.getDeletedTodos(params)
      deletedTodos.value = res.data.data || []
      if (res.data.pagination) {
        deletedPagination.value = res.data.pagination
      }
      return deletedTodos.value
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to fetch trash todos')
      return []
    } finally {
      loading.value = false
    }
  }

  async function restoreTodo(id) {
    loading.value = true
    try {
      const res = await todosApi.restoreTodo(id)
      toast.success(res.data.message || 'Todo restored successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to restore todo')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function permanentDeleteTodo(id) {
    loading.value = true
    try {
      const res = await todosApi.permanentDeleteTodo(id)
      toast.success(res.data.message || 'Todo permanently deleted')
      return { success: true }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to permanently delete todo')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    todos,
    pagination,
    deletedTodos,
    deletedPagination,
    currentTodo,
    filters,
    loading,
    fetchTodos,
    fetchTodoById,
    createTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    fetchDeletedTodos,
    restoreTodo,
    permanentDeleteTodo,
  }
})

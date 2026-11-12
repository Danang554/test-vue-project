import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersApi } from '@/api/users'
import { useToastStore } from './toast'

export const useUserStore = defineStore('user', () => {
  const toast = useToastStore()

  const users = ref([])
  const pagination = ref({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const deletedUsers = ref([])
  const deletedPagination = ref({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const currentUser = ref(null)
  const loading = ref(false)

  async function fetchUsers(params = { page: 1, limit: 10, search: '' }) {
    loading.value = true
    try {
      const res = await usersApi.getUsers(params)
      users.value = res.data.data || []
      if (res.data.pagination) {
        pagination.value = res.data.pagination
      }
      return users.value
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to fetch users')
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchUserById(id) {
    loading.value = true
    try {
      const res = await usersApi.getUserById(id)
      currentUser.value = res.data.data
      return currentUser.value
    } catch (err) {
      toast.error(err.displayMessage || `Failed to fetch user #${id}`)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createUser(payload) {
    loading.value = true
    try {
      const res = await usersApi.createUser(payload)
      toast.success(res.data.message || 'User created successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to create user', 'Validation Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id, payload) {
    loading.value = true
    try {
      const res = await usersApi.updateUser(id, payload)
      toast.success(res.data.message || 'User updated successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to update user', 'Validation Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id) {
    loading.value = true
    try {
      const res = await usersApi.deleteUser(id)
      toast.success(res.data.message || 'User soft-deleted successfully')
      return { success: true }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to delete user')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function fetchDeletedUsers(params = { page: 1, limit: 10, search: '' }) {
    loading.value = true
    try {
      const res = await usersApi.getDeletedUsers(params)
      deletedUsers.value = res.data.data || []
      if (res.data.pagination) {
        deletedPagination.value = res.data.pagination
      }
      return deletedUsers.value
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to fetch deleted users')
      return []
    } finally {
      loading.value = false
    }
  }

  async function restoreUser(id) {
    loading.value = true
    try {
      const res = await usersApi.restoreUser(id)
      toast.success(res.data.message || 'User restored successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to restore user')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function permanentDeleteUser(id) {
    loading.value = true
    try {
      const res = await usersApi.permanentDeleteUser(id)
      toast.success(res.data.message || 'User permanently deleted')
      return { success: true }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to permanently delete user')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    pagination,
    deletedUsers,
    deletedPagination,
    currentUser,
    loading,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    fetchDeletedUsers,
    restoreUser,
    permanentDeleteUser,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesApi } from '@/api/categories'
import { useToastStore } from './toast'

export const useCategoryStore = defineStore('category', () => {
  const toast = useToastStore()

  const categories = ref([])
  const pagination = ref({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const deletedCategories = ref([])
  const deletedPagination = ref({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const currentCategory = ref(null)
  const loading = ref(false)

  async function fetchCategories(params = { page: 1, limit: 10, search: '' }) {
    loading.value = true
    try {
      const res = await categoriesApi.getCategories(params)
      categories.value = res.data.data || []
      if (res.data.pagination) {
        pagination.value = res.data.pagination
      }
      return categories.value
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to fetch categories')
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryById(id) {
    loading.value = true
    try {
      const res = await categoriesApi.getCategoryById(id)
      currentCategory.value = res.data.data
      return currentCategory.value
    } catch (err) {
      toast.error(err.displayMessage || `Failed to fetch category #${id}`)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createCategory(payload) {
    loading.value = true
    try {
      const res = await categoriesApi.createCategory(payload)
      toast.success(res.data.message || 'Category created successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to create category', 'Validation Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id, payload) {
    loading.value = true
    try {
      const res = await categoriesApi.updateCategory(id, payload)
      toast.success(res.data.message || 'Category updated successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to update category', 'Validation Error', err.validationErrors)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id) {
    loading.value = true
    try {
      const res = await categoriesApi.deleteCategory(id)
      toast.success(res.data.message || 'Category moved to trash')
      return { success: true }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to delete category')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function fetchDeletedCategories(params = { page: 1, limit: 10, search: '' }) {
    loading.value = true
    try {
      const res = await categoriesApi.getDeletedCategories(params)
      deletedCategories.value = res.data.data || []
      if (res.data.pagination) {
        deletedPagination.value = res.data.pagination
      }
      return deletedCategories.value
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to fetch trash categories')
      return []
    } finally {
      loading.value = false
    }
  }

  async function restoreCategory(id) {
    loading.value = true
    try {
      const res = await categoriesApi.restoreCategory(id)
      toast.success(res.data.message || 'Category restored successfully')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to restore category')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function permanentDeleteCategory(id) {
    loading.value = true
    try {
      const res = await categoriesApi.permanentDeleteCategory(id)
      toast.success(res.data.message || 'Category permanently deleted')
      return { success: true }
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to permanently delete category')
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    pagination,
    deletedCategories,
    deletedPagination,
    currentCategory,
    loading,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchDeletedCategories,
    restoreCategory,
    permanentDeleteCategory,
  }
})

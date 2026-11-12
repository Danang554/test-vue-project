<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import CategoryModal from '@/components/category/CategoryModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Calendar,
} from 'lucide-vue-next'

const categoryStore = useCategoryStore()

const searchInput = ref('')
const showModal = ref(false)
const editingCategory = ref(null)
const modalLoading = ref(false)

const showDeleteConfirm = ref(false)
const categoryToDelete = ref(null)
const deleteLoading = ref(false)

let searchTimeout = null

onMounted(() => {
  loadCategories(1)
})

async function loadCategories(page = 1) {
  const params = {
    page,
    limit: categoryStore.pagination.limit || 10,
  }
  if (searchInput.value.trim()) {
    params.search = searchInput.value.trim()
  }
  await categoryStore.fetchCategories(params)
}

function handleSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadCategories(1)
  }, 350)
}

function openCreateModal() {
  editingCategory.value = null
  showModal.value = true
}

async function openEditModal(category) {
  const detail = await categoryStore.fetchCategoryById(category.id)
  editingCategory.value = detail || category
  showModal.value = true
}

async function handleSaveCategory(payload) {
  modalLoading.value = true
  let res
  if (payload.id) {
    res = await categoryStore.updateCategory(payload.id, payload)
  } else {
    res = await categoryStore.createCategory(payload)
  }
  modalLoading.value = false

  if (res.success) {
    showModal.value = false
    await loadCategories(categoryStore.pagination.page)
  }
}

function confirmDelete(category) {
  categoryToDelete.value = category
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!categoryToDelete.value) return
  deleteLoading.value = true
  const res = await categoryStore.deleteCategory(categoryToDelete.value.id)
  deleteLoading.value = false

  if (res.success) {
    showDeleteConfirm.value = false
    categoryToDelete.value = null
    await loadCategories(categoryStore.pagination.page)
  }
}

function onPageChange(page) {
  loadCategories(page)
}

function onLimitChange(limit) {
  categoryStore.pagination.limit = limit
  loadCategories(1)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <FolderKanban class="w-6 h-6 text-violet-600 dark:text-violet-400" />
          <span>Category Management</span>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Group your tasks by category (Creator Scoped - each user manages their own categories).
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Create Category</span>
      </button>
    </div>

    <!-- Search Toolbar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3 transition-colors duration-200">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchInput"
          @input="handleSearchChange"
          type="text"
          placeholder="Search categories by name..."
          class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''; loadCategories(1)"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Category Grid / List -->
    <div>
      <div v-if="categoryStore.loading" class="py-16">
        <LoadingSpinner text="Loading categories..." />
      </div>

      <div v-else-if="categoryStore.categories.length === 0" class="p-8">
        <EmptyState
          title="No categories found"
          description="Create your first category to organize your todos efficiently."
        >
          <template #action>
            <button
              type="button"
              @click="openCreateModal"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              + Create Category
            </button>
          </template>
        </EmptyState>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div>
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-xs">
                  #{{ cat.id }}
                </div>
                <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 break-words">
                  {{ cat.name }}
                </h3>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                <button
                  type="button"
                  @click="openEditModal(cat)"
                  title="Edit Category"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="confirmDelete(cat)"
                  title="Move to Trash"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {{ cat.description || 'No description provided.' }}
            </p>
          </div>

          <div class="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span v-if="cat.created_at" class="inline-flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              <span>{{ formatDate(cat.created_at) }}</span>
            </span>
            <span v-else>Active Category</span>
            <span class="font-mono text-[10px]">ID: {{ cat.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationBar
      :pagination="categoryStore.pagination"
      :loading="categoryStore.loading"
      @change-page="onPageChange"
      @change-limit="onLimitChange"
    />

    <!-- Add/Edit Category Modal -->
    <CategoryModal
      :show="showModal"
      :category="editingCategory"
      :loading="modalLoading"
      @close="showModal = false"
      @save="handleSaveCategory"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Delete Category"
      :message="`Are you sure you want to move category '${categoryToDelete?.name}' to trash? Associated todos will retain category_id unless detached.`"
      confirmText="Move to Trash"
      variant="danger"
      :loading="deleteLoading"
      @cancel="showDeleteConfirm = false"
      @confirm="handleDelete"
    />
  </div>
</template>

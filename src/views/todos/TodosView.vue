<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useCategoryStore } from '@/stores/category'
import TodoModal from '@/components/todo/TodoModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  X,
  Calendar,
  Folder,
} from 'lucide-vue-next'

const todoStore = useTodoStore()
const categoryStore = useCategoryStore()

const searchInput = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('') // '', 'true', 'false'

const showModal = ref(false)
const editingTodo = ref(null)
const modalLoading = ref(false)

const showDeleteConfirm = ref(false)
const todoToDelete = ref(null)
const deleteLoading = ref(false)

let searchTimeout = null

onMounted(async () => {
  await Promise.allSettled([
    categoryStore.fetchCategories({ page: 1, limit: 100 }),
    loadTodos(1),
  ])
})

async function loadTodos(page = 1) {
  const params = {
    page,
    limit: todoStore.pagination.limit || 10,
  }
  if (searchInput.value.trim()) params.search = searchInput.value.trim()
  if (selectedCategory.value !== '') params.category_id = Number(selectedCategory.value)
  if (selectedStatus.value !== '') params.is_completed = selectedStatus.value === 'true'

  await todoStore.fetchTodos(params)
}

function handleSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTodos(1)
  }, 350)
}

function clearFilters() {
  searchInput.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  loadTodos(1)
}

function openCreateModal() {
  editingTodo.value = null
  showModal.value = true
}

async function openEditModal(todo) {
  const detail = await todoStore.fetchTodoById(todo.id)
  editingTodo.value = detail || todo
  showModal.value = true
}

async function handleSaveTodo(payload) {
  modalLoading.value = true
  let res
  if (payload.id) {
    res = await todoStore.updateTodo(payload.id, payload)
  } else {
    res = await todoStore.createTodo(payload)
  }
  modalLoading.value = false

  if (res.success) {
    showModal.value = false
    await loadTodos(todoStore.pagination.page)
  }
}

function confirmDelete(todo) {
  todoToDelete.value = todo
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!todoToDelete.value) return
  deleteLoading.value = true
  const res = await todoStore.deleteTodo(todoToDelete.value.id)
  deleteLoading.value = false

  if (res.success) {
    showDeleteConfirm.value = false
    todoToDelete.value = null
    await loadTodos(todoStore.pagination.page)
  }
}

async function handleToggleComplete(id) {
  await todoStore.toggleComplete(id)
}

function onPageChange(page) {
  loadTodos(page)
}

function onLimitChange(limit) {
  todoStore.pagination.limit = limit
  loadTodos(1)
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
          <CheckSquare class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Todo Management</span>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your daily tasks, filter by category or completion status.
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Create New Todo</span>
      </button>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors duration-200">
      <!-- Search Input -->
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchInput"
          @input="handleSearchChange"
          type="text"
          placeholder="Search todos by title..."
          class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''; loadTodos(1)"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="loadTodos(1)"
          class="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          @change="loadTodos(1)"
          class="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">All Statuses</option>
          <option value="false">Pending (Active)</option>
          <option value="true">Completed</option>
        </select>

        <!-- Reset Button -->
        <button
          v-if="searchInput || selectedCategory !== '' || selectedStatus !== ''"
          type="button"
          @click="clearFilters"
          class="px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Todos List / Content -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
      <div v-if="todoStore.loading" class="py-16">
        <LoadingSpinner text="Loading todos..." />
      </div>

      <div v-else-if="todoStore.todos.length === 0" class="p-8">
        <EmptyState
          title="No todos found"
          description="We couldn't find any todos matching your filters. Try creating one!"
        >
          <template #action>
            <button
              type="button"
              @click="openCreateModal"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              + Create Todo
            </button>
          </template>
        </EmptyState>
      </div>

      <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
        >
          <div class="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            <!-- Complete Checkbox Toggle -->
            <button
              type="button"
              @click="handleToggleComplete(todo.id)"
              class="flex-shrink-0 mt-0.5 sm:mt-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              :title="todo.is_completed ? 'Mark uncompleted' : 'Mark completed'"
            >
              <CheckCircle2
                v-if="todo.is_completed"
                class="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40"
              />
              <Circle v-else class="w-5 h-5" />
            </button>

            <!-- Todo info -->
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h4
                  class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-words"
                  :class="{ 'line-through text-slate-400 dark:text-slate-500': todo.is_completed }"
                >
                  {{ todo.title }}
                </h4>

                <StatusBadge v-if="todo.category" variant="primary">
                  <Folder class="w-3 h-3" />
                  <span>{{ todo.category.name }}</span>
                </StatusBadge>

                <StatusBadge :variant="todo.is_completed ? 'success' : 'warning'">
                  {{ todo.is_completed ? 'Completed' : 'Pending' }}
                </StatusBadge>
              </div>

              <p v-if="todo.description" class="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                {{ todo.description }}
              </p>

              <div class="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                <span v-if="todo.created_at" class="inline-flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  <span>{{ formatDate(todo.created_at) }}</span>
                </span>
                <span class="font-mono text-[10px]">ID: #{{ todo.id }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              @click="openEditModal(todo)"
              title="Edit Todo"
              class="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              <Edit2 class="w-4 h-4" />
            </button>

            <button
              type="button"
              @click="confirmDelete(todo)"
              title="Move to Trash"
              class="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationBar
      :pagination="todoStore.pagination"
      :loading="todoStore.loading"
      @change-page="onPageChange"
      @change-limit="onLimitChange"
    />

    <!-- Add/Edit Todo Modal -->
    <TodoModal
      :show="showModal"
      :todo="editingTodo"
      :categories="categoryStore.categories"
      :loading="modalLoading"
      @close="showModal = false"
      @save="handleSaveTodo"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Delete Todo"
      :message="`Are you sure you want to move '${todoToDelete?.title}' to trash? You can restore it later from Trash Bin.`"
      confirmText="Move to Trash"
      variant="danger"
      :loading="deleteLoading"
      @cancel="showDeleteConfirm = false"
      @confirm="handleDelete"
    />
  </div>
</template>

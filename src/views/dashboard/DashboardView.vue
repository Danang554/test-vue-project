<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { useHealthStore } from '@/stores/health'
import TodoModal from '@/components/todo/TodoModal.vue'
import CategoryModal from '@/components/category/CategoryModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import {
  CheckSquare,
  Clock,
  FolderKanban,
  Users,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle2,
  Circle,
  Database,
  Server,
  Zap,
  Code2,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()
const healthStore = useHealthStore()

const loadingData = ref(true)
const showTodoModal = ref(false)
const showCategoryModal = ref(false)
const modalLoading = ref(false)

onMounted(async () => {
  loadingData.value = true
  await Promise.allSettled([
    healthStore.checkHealth(),
    todoStore.fetchTodos({ page: 1, limit: 10 }),
    categoryStore.fetchCategories({ page: 1, limit: 50 }),
    authStore.isAdmin ? userStore.fetchUsers({ page: 1, limit: 5 }) : Promise.resolve(),
  ])
  loadingData.value = false
})

const totalTodos = computed(() => todoStore.pagination.total_items || 0)
const totalCategories = computed(() => categoryStore.pagination.total_items || 0)
const totalUsers = computed(() => userStore.pagination.total_items || 0)

const completedCount = computed(() => {
  return todoStore.todos.filter((t) => t.is_completed).length
})

const pendingCount = computed(() => {
  return todoStore.todos.filter((t) => !t.is_completed).length
})

async function handleToggleComplete(id) {
  await todoStore.toggleComplete(id)
}

async function handleSaveTodo(payload) {
  modalLoading.value = true
  const res = await todoStore.createTodo(payload)
  modalLoading.value = false
  if (res.success) {
    showTodoModal.value = false
    await todoStore.fetchTodos({ page: 1, limit: 10 })
  }
}

async function handleSaveCategory(payload) {
  modalLoading.value = true
  const res = await categoryStore.createCategory(payload)
  modalLoading.value = false
  if (res.success) {
    showCategoryModal.value = false
    await categoryStore.fetchCategories({ page: 1, limit: 50 })
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header & Server Status Banner -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Hi, {{ authStore.user?.name || 'Explorer' }}!
          </h2>
          <span
            v-if="authStore.isAdmin"
            class="px-2 py-0.5 text-[11px] font-bold uppercase rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
          >
            Admin
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Welcome to your REST API frontend dashboard. Everything is connected in real-time.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="showTodoModal = true"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Todo</span>
        </button>

        <button
          type="button"
          @click="showCategoryModal = true"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>

        <RouterLink
          to="/api-explorer"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 transition"
        >
          <Code2 class="w-3.5 h-3.5" />
          <span>API Explorer</span>
        </RouterLink>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Todos -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <div>
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Todos</span>
          <div class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ totalTodos }}</div>
          <span class="text-[11px] text-slate-400 dark:text-slate-500">Scoped to your account</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <CheckSquare class="w-6 h-6" />
        </div>
      </div>

      <!-- Pending / Active Todos -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <div>
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Active Tasks</span>
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ pendingCount }}</div>
          <span class="text-[11px] text-slate-400 dark:text-slate-500">In current page</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Clock class="w-6 h-6" />
        </div>
      </div>

      <!-- Categories -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <div>
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Categories</span>
          <div class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ totalCategories }}</div>
          <span class="text-[11px] text-slate-400 dark:text-slate-500">Tags & classifications</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
          <FolderKanban class="w-6 h-6" />
        </div>
      </div>

      <!-- Server / Admin Stats -->
      <div
        v-if="authStore.isAdmin"
        class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200"
      >
        <div>
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Users</span>
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ totalUsers }}</div>
          <span class="text-[11px] text-purple-500 dark:text-purple-400 font-medium">Admin view</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <Users class="w-6 h-6" />
        </div>
      </div>

      <div
        v-else
        class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200"
      >
        <div>
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Backend Health</span>
          <div class="text-sm font-bold mt-1" :class="healthStore.isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
            {{ healthStore.isOnline ? 'Healthy' : 'Disconnected' }}
          </div>
          <span class="text-[11px] font-mono text-slate-400 dark:text-slate-500">{{ healthStore.latency }}ms latency</span>
        </div>
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center"
          :class="healthStore.isOnline ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'"
        >
          <Activity class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Recent Todos Section & Quick Info -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Todos Table (2 columns) -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Your Recent Todos</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Directly syncs with <code class="text-indigo-600 dark:text-indigo-400 font-mono">/api/todo</code></p>
          </div>
          <RouterLink
            to="/todos"
            class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <span>View All</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>

        <div v-if="loadingData" class="py-12">
          <LoadingSpinner text="Fetching todos..." />
        </div>

        <div v-else-if="todoStore.todos.length === 0" class="p-6">
          <EmptyState
            title="No todos found"
            description="You don't have any todos yet. Click below to add your first one!"
          >
            <template #action>
              <button
                type="button"
                @click="showTodoModal = true"
                class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                + Add Todo
              </button>
            </template>
          </EmptyState>
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="todo in todoStore.todos.slice(0, 5)"
            :key="todo.id"
            class="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <button
                type="button"
                @click="handleToggleComplete(todo.id)"
                class="flex-shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                :title="todo.is_completed ? 'Mark uncompleted' : 'Mark completed'"
              >
                <CheckCircle2
                  v-if="todo.is_completed"
                  class="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40"
                />
                <Circle v-else class="w-5 h-5" />
              </button>

              <div class="min-w-0">
                <p
                  class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate"
                  :class="{ 'line-through text-slate-400 dark:text-slate-500': todo.is_completed }"
                >
                  {{ todo.title }}
                </p>
                <p v-if="todo.description" class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {{ todo.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <StatusBadge v-if="todo.category" variant="primary">
                {{ todo.category.name }}
              </StatusBadge>
              <StatusBadge
                :variant="todo.is_completed ? 'success' : 'warning'"
              >
                {{ todo.is_completed ? 'Done' : 'Pending' }}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Architecture Card -->
      <div class="space-y-4">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
          <div class="flex items-center gap-2">
            <Server class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Endpoint System Overview</h3>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">Framework</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">Golang (Gin Gonic)</span>
            </div>
            <div class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">ORM & Driver</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">GORM (MySQL)</span>
            </div>
            <div class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">Authentication</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">JWT Bearer Token</span>
            </div>
            <div class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400">Soft Deletes</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">Yes (gorm.DeletedAt)</span>
            </div>
            <div class="flex justify-between items-center py-1.5">
              <span class="text-slate-500 dark:text-slate-400">Database Status</span>
              <StatusBadge :variant="healthStore.dbStatus === 'connected' ? 'success' : 'warning'">
                {{ healthStore.dbStatus }}
              </StatusBadge>
            </div>
          </div>

          <button
            type="button"
            @click="router.push('/api-explorer')"
            class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 transition"
          >
            <Code2 class="w-4 h-4" />
            <span>Open Interactive API Runner</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TodoModal
      :show="showTodoModal"
      :categories="categoryStore.categories"
      :loading="modalLoading"
      @close="showTodoModal = false"
      @save="handleSaveTodo"
    />

    <CategoryModal
      :show="showCategoryModal"
      :loading="modalLoading"
      @close="showCategoryModal = false"
      @save="handleSaveCategory"
    />
  </div>
</template>

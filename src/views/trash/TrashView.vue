<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import {
  Trash2,
  RotateCcw,
  AlertOctagon,
  CheckSquare,
  FolderKanban,
  Users,
  Search,
  X,
  Calendar,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const todoStore = useTodoStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()

const activeTab = ref('todos') // 'todos', 'categories', 'users'
const searchInput = ref('')

const showConfirmModal = ref(false)
const confirmActionType = ref('restore') // 'restore' | 'permanent'
const confirmItemType = ref('todo') // 'todo' | 'category' | 'user'
const targetItem = ref(null)
const actionLoading = ref(false)

let searchTimeout = null

onMounted(() => {
  loadTabData(1)
})

function setTab(tab) {
  activeTab.value = tab
  searchInput.value = ''
  loadTabData(1)
}

async function loadTabData(page = 1) {
  const params = { page, limit: 10 }
  if (searchInput.value.trim()) params.search = searchInput.value.trim()

  if (activeTab.value === 'todos') {
    await todoStore.fetchDeletedTodos(params)
  } else if (activeTab.value === 'categories') {
    await categoryStore.fetchDeletedCategories(params)
  } else if (activeTab.value === 'users' && authStore.isAdmin) {
    await userStore.fetchDeletedUsers(params)
  }
}

function handleSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTabData(1)
  }, 350)
}

function askRestore(type, item) {
  confirmItemType.value = type
  confirmActionType.value = 'restore'
  targetItem.value = item
  showConfirmModal.value = true
}

function askPermanentDelete(type, item) {
  confirmItemType.value = type
  confirmActionType.value = 'permanent'
  targetItem.value = item
  showConfirmModal.value = true
}

async function handleConfirmAction() {
  if (!targetItem.value) return
  actionLoading.value = true
  const id = targetItem.value.id

  if (confirmActionType.value === 'restore') {
    if (confirmItemType.value === 'todo') {
      await todoStore.restoreTodo(id)
    } else if (confirmItemType.value === 'category') {
      await categoryStore.restoreCategory(id)
    } else if (confirmItemType.value === 'user') {
      await userStore.restoreUser(id)
    }
  } else {
    // Permanent Delete
    if (confirmItemType.value === 'todo') {
      await todoStore.permanentDeleteTodo(id)
    } else if (confirmItemType.value === 'category') {
      await categoryStore.permanentDeleteCategory(id)
    } else if (confirmItemType.value === 'user') {
      await userStore.permanentDeleteUser(id)
    }
  }

  actionLoading.value = false
  showConfirmModal.value = false
  targetItem.value = null
  await loadTabData(currentPagination.value.page)
}

const currentPagination = computed(() => {
  if (activeTab.value === 'todos') return todoStore.deletedPagination
  if (activeTab.value === 'categories') return categoryStore.deletedPagination
  if (activeTab.value === 'users') return userStore.deletedPagination
  return { page: 1, limit: 10, total_items: 0, total_pages: 1 }
})

const isLoading = computed(() => {
  if (activeTab.value === 'todos') return todoStore.loading
  if (activeTab.value === 'categories') return categoryStore.loading
  if (activeTab.value === 'users') return userStore.loading
  return false
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Trash2 class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Trash Bin</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View soft-deleted items across todos, categories, and users. Restore them or permanently purge.
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          @click="setTab('todos')"
          class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition"
          :class="[
            activeTab === 'todos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ]"
        >
          <CheckSquare class="w-4 h-4" />
          <span>Deleted Todos</span>
          <span
            v-if="todoStore.deletedPagination.total_items > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
          >
            {{ todoStore.deletedPagination.total_items }}
          </span>
        </button>

        <button
          type="button"
          @click="setTab('categories')"
          class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition"
          :class="[
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ]"
        >
          <FolderKanban class="w-4 h-4" />
          <span>Deleted Categories</span>
          <span
            v-if="categoryStore.deletedPagination.total_items > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 font-bold"
          >
            {{ categoryStore.deletedPagination.total_items }}
          </span>
        </button>

        <button
          v-if="authStore.isAdmin"
          type="button"
          @click="setTab('users')"
          class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition"
          :class="[
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ]"
        >
          <Users class="w-4 h-4" />
          <span>Deleted Users (Admin)</span>
          <span
            v-if="userStore.deletedPagination.total_items > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold"
          >
            {{ userStore.deletedPagination.total_items }}
          </span>
        </button>
      </div>
    </div>

    <!-- Search input -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3 transition-colors duration-200">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchInput"
          @input="handleSearchChange"
          type="text"
          :placeholder="`Search deleted ${activeTab}...`"
          class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''; loadTabData(1)"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Trash Content Container -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
      <div v-if="isLoading" class="py-16">
        <LoadingSpinner text="Fetching trash contents..." />
      </div>

      <!-- 1. Todos Tab -->
      <div v-else-if="activeTab === 'todos'">
        <div v-if="todoStore.deletedTodos.length === 0" class="p-8">
          <EmptyState
            title="Todo trash is empty"
            description="You don't have any deleted todos. Items you delete will appear here."
          />
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="item in todoStore.deletedTodos"
            :key="item.id"
            class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h4 class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 line-through">
                  {{ item.title }}
                </h4>
                <StatusBadge variant="danger">Deleted</StatusBadge>
              </div>
              <p v-if="item.description" class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {{ item.description }}
              </p>
              <div class="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                <span v-if="item.deleted_at">Deleted: {{ formatDate(item.deleted_at) }}</span>
                <span class="font-mono text-[10px]">ID: #{{ item.id }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                @click="askRestore('todo', item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 transition"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>

              <button
                type="button"
                @click="askPermanentDelete('todo', item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition"
              >
                <AlertOctagon class="w-3.5 h-3.5" />
                <span>Purge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Categories Tab -->
      <div v-else-if="activeTab === 'categories'">
        <div v-if="categoryStore.deletedCategories.length === 0" class="p-8">
          <EmptyState
            title="Category trash is empty"
            description="You don't have any deleted categories."
          />
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="item in categoryStore.deletedCategories"
            :key="item.id"
            class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h4 class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 line-through">
                  {{ item.name }}
                </h4>
                <StatusBadge variant="danger">Deleted</StatusBadge>
              </div>
              <p v-if="item.description" class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {{ item.description }}
              </p>
              <div class="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                <span v-if="item.deleted_at">Deleted: {{ formatDate(item.deleted_at) }}</span>
                <span class="font-mono text-[10px]">ID: #{{ item.id }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                @click="askRestore('category', item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 transition"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>

              <button
                type="button"
                @click="askPermanentDelete('category', item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition"
              >
                <AlertOctagon class="w-3.5 h-3.5" />
                <span>Purge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Users Tab (Admin) -->
      <div v-else-if="activeTab === 'users' && authStore.isAdmin">
        <div v-if="userStore.deletedUsers.length === 0" class="p-8">
          <EmptyState
            title="User trash is empty"
            description="No users are currently soft-deleted."
          />
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="item in userStore.deletedUsers"
            :key="item.id"
            class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h4 class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 line-through">
                  {{ item.name }}
                </h4>
                <StatusBadge variant="purple" v-if="item.is_admin">Admin</StatusBadge>
                <StatusBadge variant="danger">Deleted</StatusBadge>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ item.email }}</p>
              <div class="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                <span v-if="item.deleted_at">Deleted: {{ formatDate(item.deleted_at) }}</span>
                <span class="font-mono text-[10px]">ID: #{{ item.id }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                @click="askRestore('user', item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 transition"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>

              <button
                type="button"
                @click="askPermanentDelete('user', item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition"
              >
                <AlertOctagon class="w-3.5 h-3.5" />
                <span>Purge</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationBar
      :pagination="currentPagination"
      :loading="isLoading"
      @change-page="(p) => loadTabData(p)"
      @change-limit="(l) => { currentPagination.limit = l; loadTabData(1); }"
    />

    <!-- Action Confirmation Dialog -->
    <ConfirmDialog
      :show="showConfirmModal"
      :title="confirmActionType === 'restore' ? 'Restore Item' : 'Permanent Delete Item'"
      :message="confirmActionType === 'restore'
        ? `Are you sure you want to restore this ${confirmItemType}? It will be returned to active lists.`
        : `DANGER: Are you sure you want to permanently delete this ${confirmItemType}? This operation CANNOT be undone and physically removes the record from MySQL database!`"
      :confirmText="confirmActionType === 'restore' ? 'Restore' : 'Permanently Delete'"
      :variant="confirmActionType === 'restore' ? 'primary' : 'danger'"
      :loading="actionLoading"
      @cancel="showConfirmModal = false"
      @confirm="handleConfirmAction"
    />
  </div>
</template>

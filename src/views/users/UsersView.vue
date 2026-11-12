<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import UserModal from '@/components/user/UserModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  User as UserIcon,
  X,
  Mail,
  Calendar,
} from 'lucide-vue-next'

const userStore = useUserStore()

const searchInput = ref('')
const showModal = ref(false)
const editingUser = ref(null)
const modalLoading = ref(false)

const showDeleteConfirm = ref(false)
const userToDelete = ref(null)
const deleteLoading = ref(false)

let searchTimeout = null

onMounted(() => {
  loadUsers(1)
})

async function loadUsers(page = 1) {
  const params = {
    page,
    limit: userStore.pagination.limit || 10,
  }
  if (searchInput.value.trim()) {
    params.search = searchInput.value.trim()
  }
  await userStore.fetchUsers(params)
}

function handleSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers(1)
  }, 350)
}

function openCreateModal() {
  editingUser.value = null
  showModal.value = true
}

async function openEditModal(user) {
  const detail = await userStore.fetchUserById(user.id)
  editingUser.value = detail || user
  showModal.value = true
}

async function handleSaveUser(payload) {
  modalLoading.value = true
  let res
  if (payload.id) {
    res = await userStore.updateUser(payload.id, payload)
  } else {
    res = await userStore.createUser(payload)
  }
  modalLoading.value = false

  if (res.success) {
    showModal.value = false
    await loadUsers(userStore.pagination.page)
  }
}

function confirmDelete(user) {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!userToDelete.value) return
  deleteLoading.value = true
  const res = await userStore.deleteUser(userToDelete.value.id)
  deleteLoading.value = false

  if (res.success) {
    showDeleteConfirm.value = false
    userToDelete.value = null
    await loadUsers(userStore.pagination.page)
  }
}

function onPageChange(page) {
  loadUsers(page)
}

function onLimitChange(limit) {
  userStore.pagination.limit = limit
  loadUsers(1)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
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
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>User Management</span>
          </h2>
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
            Admin Only
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Create, edit, search, and soft-delete user accounts across the system.
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30 transition self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Add New User</span>
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
          placeholder="Search users by name or email..."
          class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''; loadUsers(1)"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
      <div v-if="userStore.loading" class="py-16">
        <LoadingSpinner text="Loading users..." />
      </div>

      <div v-else-if="userStore.users.length === 0" class="p-8">
        <EmptyState
          title="No users found"
          description="No users matched your query. Add a new user to populate this list."
        >
          <template #action>
            <button
              type="button"
              @click="openCreateModal"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              + Add User
            </button>
          </template>
        </EmptyState>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <th class="py-3.5 px-4 sm:px-6">User</th>
              <th class="py-3.5 px-4">Role</th>
              <th class="py-3.5 px-4 hidden sm:table-cell">Created At</th>
              <th class="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              v-for="user in userStore.users"
              :key="user.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
            >
              <td class="py-3.5 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    :class="user.is_admin ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
                  >
                    {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </div>
                  <div class="min-w-0">
                    <div class="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {{ user.name }}
                    </div>
                    <div class="text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate text-[11px]">
                      <Mail class="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span>{{ user.email }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4">
                <StatusBadge :variant="user.is_admin ? 'purple' : 'neutral'">
                  <Shield v-if="user.is_admin" class="w-3 h-3" />
                  <UserIcon v-else class="w-3 h-3" />
                  <span>{{ user.is_admin ? 'Administrator' : 'Standard User' }}</span>
                </StatusBadge>
              </td>

              <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                {{ formatDate(user.created_at) }}
              </td>

              <td class="py-3.5 px-4 sm:px-6 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(user)"
                    title="Edit User"
                    class="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    @click="confirmDelete(user)"
                    title="Delete User"
                    class="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationBar
      :pagination="userStore.pagination"
      :loading="userStore.loading"
      @change-page="onPageChange"
      @change-limit="onLimitChange"
    />

    <!-- User Modal -->
    <UserModal
      :show="showModal"
      :user="editingUser"
      :loading="modalLoading"
      @close="showModal = false"
      @save="handleSaveUser"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Delete User Account"
      :message="`Are you sure you want to soft-delete '${userToDelete?.name}'? You can restore this account from the Trash Bin.`"
      confirmText="Soft Delete"
      variant="danger"
      :loading="deleteLoading"
      @cancel="showDeleteConfirm = false"
      @confirm="handleDelete"
    />
  </div>
</template>

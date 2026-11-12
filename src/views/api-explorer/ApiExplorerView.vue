<script setup>
import { ref, computed } from 'vue'
import apiClient from '@/api/client'
import StatusBadge from '@/components/common/StatusBadge.vue'
import {
  Code2,
  Play,
  Copy,
  Check,
  Server,
  Shield,
  Activity,
  Layers,
  Database,
  ArrowRight,
} from 'lucide-vue-next'

const endpoints = [
  // Health
  {
    id: 'health',
    group: 'Health',
    method: 'GET',
    path: '/health',
    description: 'Check service & database connectivity status',
    auth: false,
    params: [],
    body: null,
  },
  // Auth
  {
    id: 'auth-register',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register a new user account',
    auth: false,
    params: [],
    body: JSON.stringify(
      {
        name: 'New Tester',
        email: `tester_${Math.floor(Math.random() * 9000 + 1000)}@example.com`,
        password: 'password123',
      },
      null,
      2,
    ),
  },
  {
    id: 'auth-login',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/login',
    description: 'Login with credentials and receive JWT token',
    auth: false,
    params: [],
    body: JSON.stringify(
      {
        email: 'admin@example.com',
        password: 'password',
      },
      null,
      2,
    ),
  },
  {
    id: 'auth-logout',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/logout',
    description: 'Revoke the current JWT token',
    auth: true,
    params: [],
    body: null,
  },
  // Profile
  {
    id: 'profile-get',
    group: 'Profile',
    method: 'GET',
    path: '/api/profile',
    description: 'Retrieve current authenticated user profile',
    auth: true,
    params: [],
    body: null,
  },
  {
    id: 'profile-patch',
    group: 'Profile',
    method: 'PATCH',
    path: '/api/profile',
    description: 'Update current authenticated user profile',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        name: 'Updated Name',
        email: 'admin@example.com',
      },
      null,
      2,
    ),
  },
  // Todo
  {
    id: 'todo-list',
    group: 'Todo',
    method: 'GET',
    path: '/api/todo',
    description: 'Get list of creator-scoped todos with pagination & filter',
    auth: true,
    params: [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
      { name: 'search', value: '' },
      { name: 'is_completed', value: '' },
      { name: 'category_id', value: '' },
    ],
    body: null,
  },
  {
    id: 'todo-create',
    group: 'Todo',
    method: 'POST',
    path: '/api/todo',
    description: 'Create a new todo task',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        title: 'New Automated Todo Task',
        description: 'Created from API Explorer',
        category_id: null,
      },
      null,
      2,
    ),
  },
  {
    id: 'todo-detail',
    group: 'Todo',
    method: 'GET',
    path: '/api/todo/:id',
    description: 'Get detail of single todo by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'todo-update',
    group: 'Todo',
    method: 'PATCH',
    path: '/api/todo/:id',
    description: 'Update a todo title, description, category or completion',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: JSON.stringify(
      {
        title: 'Updated Todo Title',
        description: 'Updated description from API Explorer',
        is_completed: true,
      },
      null,
      2,
    ),
  },
  {
    id: 'todo-complete',
    group: 'Todo',
    method: 'PATCH',
    path: '/api/todo/:id/complete',
    description: 'Toggle todo completion status (is_completed)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'todo-delete',
    group: 'Todo',
    method: 'DELETE',
    path: '/api/todo/:id',
    description: 'Soft delete todo (move to trash)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'todo-deleted-list',
    group: 'Todo',
    method: 'GET',
    path: '/api/todo/deleted',
    description: 'List all soft-deleted todos',
    auth: true,
    params: [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
    ],
    body: null,
  },
  {
    id: 'todo-restore',
    group: 'Todo',
    method: 'PATCH',
    path: '/api/todo/:id/restore',
    description: 'Restore a soft-deleted todo from trash',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'todo-permanent',
    group: 'Todo',
    method: 'DELETE',
    path: '/api/todo/:id/permanent',
    description: 'Permanently purge todo from database',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  // Category
  {
    id: 'category-list',
    group: 'Category',
    method: 'GET',
    path: '/api/category',
    description: 'Get list of creator-scoped categories',
    auth: true,
    params: [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
      { name: 'search', value: '' },
    ],
    body: null,
  },
  {
    id: 'category-create',
    group: 'Category',
    method: 'POST',
    path: '/api/category',
    description: 'Create a new category',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        name: 'Urgent Work',
        description: 'High priority tasks category',
      },
      null,
      2,
    ),
  },
  {
    id: 'category-detail',
    group: 'Category',
    method: 'GET',
    path: '/api/category/:id',
    description: 'Get detail of single category by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'category-update',
    group: 'Category',
    method: 'PATCH',
    path: '/api/category/:id',
    description: 'Update category name or description',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: JSON.stringify(
      {
        name: 'Updated Category Name',
        description: 'New category description',
      },
      null,
      2,
    ),
  },
  {
    id: 'category-delete',
    group: 'Category',
    method: 'DELETE',
    path: '/api/category/:id',
    description: 'Soft delete category',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'category-deleted-list',
    group: 'Category',
    method: 'GET',
    path: '/api/category/deleted',
    description: 'List all soft-deleted categories',
    auth: true,
    params: [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
    ],
    body: null,
  },
  {
    id: 'category-restore',
    group: 'Category',
    method: 'PATCH',
    path: '/api/category/:id/restore',
    description: 'Restore category from trash',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'category-permanent',
    group: 'Category',
    method: 'DELETE',
    path: '/api/category/:id/permanent',
    description: 'Permanently purge category',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  // User (Admin)
  {
    id: 'user-list',
    group: 'User (Admin)',
    method: 'GET',
    path: '/api/user',
    description: 'Admin: Get list of all users',
    auth: true,
    adminOnly: true,
    params: [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
      { name: 'search', value: '' },
    ],
    body: null,
  },
  {
    id: 'user-create',
    group: 'User (Admin)',
    method: 'POST',
    path: '/api/user',
    description: 'Admin: Create a new user account with role flag',
    auth: true,
    adminOnly: true,
    params: [],
    body: JSON.stringify(
      {
        name: 'Admin Created User',
        email: `adm_user_${Math.floor(Math.random() * 9000 + 1000)}@example.com`,
        password: 'password123',
        is_admin: false,
      },
      null,
      2,
    ),
  },
  {
    id: 'user-detail',
    group: 'User (Admin)',
    method: 'GET',
    path: '/api/user/:id',
    description: 'Admin: Get user details by ID',
    auth: true,
    adminOnly: true,
    pathParam: { name: 'id', value: '1' },
    body: null,
  },
  {
    id: 'user-update',
    group: 'User (Admin)',
    method: 'PATCH',
    path: '/api/user/:id',
    description: 'Admin: Update user details or role',
    auth: true,
    adminOnly: true,
    pathParam: { name: 'id', value: '1' },
    body: JSON.stringify(
      {
        name: 'Updated User Name',
        email: 'user@example.com',
        is_admin: false,
      },
      null,
      2,
    ),
  },
  {
    id: 'user-delete',
    group: 'User (Admin)',
    method: 'DELETE',
    path: '/api/user/:id',
    description: 'Admin: Soft delete user account',
    auth: true,
    adminOnly: true,
    pathParam: { name: 'id', value: '2' },
    body: null,
  },
  {
    id: 'user-deleted-list',
    group: 'User (Admin)',
    method: 'GET',
    path: '/api/user/deleted',
    description: 'Admin: List all soft-deleted users',
    auth: true,
    adminOnly: true,
    params: [
      { name: 'page', value: '1' },
      { name: 'limit', value: '10' },
    ],
    body: null,
  },
  {
    id: 'user-restore',
    group: 'User (Admin)',
    method: 'PATCH',
    path: '/api/user/:id/restore',
    description: 'Admin: Restore soft-deleted user account',
    auth: true,
    adminOnly: true,
    pathParam: { name: 'id', value: '2' },
    body: null,
  },
  {
    id: 'user-permanent',
    group: 'User (Admin)',
    method: 'DELETE',
    path: '/api/user/:id/permanent',
    description: 'Admin: Permanently purge user account',
    auth: true,
    adminOnly: true,
    pathParam: { name: 'id', value: '999' },
    body: null,
  },
]

const selectedEndpointId = ref('health')
const selectedEndpoint = computed(() => {
  return endpoints.find((e) => e.id === selectedEndpointId.value) || endpoints[0]
})

const activePathId = ref('1')
const queryParams = ref({})
const requestBody = ref('')
const executing = ref(false)
const copied = ref(false)

const responseData = ref(null)
const responseStatus = ref(null)
const responseStatusText = ref('')
const responseLatency = ref(0)
const responseHeaders = ref(null)

// Initialize inputs when selecting endpoint
function selectEndpoint(ep) {
  selectedEndpointId.value = ep.id
  activePathId.value = ep.pathParam?.value || '1'
  requestBody.value = ep.body || ''

  const q = {}
  if (ep.params) {
    ep.params.forEach((p) => {
      q[p.name] = p.value
    })
  }
  queryParams.value = q
  responseData.value = null
  responseStatus.value = null
}

selectEndpoint(endpoints[0])

async function executeRequest() {
  executing.value = true
  responseData.value = null
  responseStatus.value = null
  const startTime = performance.now()

  let finalUrl = selectedEndpoint.value.path
  if (selectedEndpoint.value.pathParam) {
    finalUrl = finalUrl.replace(':id', activePathId.value)
  }

  // Filter non-empty query params
  const cleanParams = {}
  Object.keys(queryParams.value).forEach((key) => {
    const val = queryParams.value[key]
    if (val !== '' && val !== null && val !== undefined) {
      cleanParams[key] = val
    }
  })

  let payload = null
  if (selectedEndpoint.value.body) {
    try {
      payload = JSON.parse(requestBody.value)
    } catch (e) {
      alert('Invalid JSON in request body!')
      executing.value = false
      return
    }
  }

  try {
    const res = await apiClient({
      method: selectedEndpoint.value.method,
      url: finalUrl,
      params: cleanParams,
      data: payload,
    })

    responseLatency.value = Math.round(performance.now() - startTime)
    responseStatus.value = res.status
    responseStatusText.value = res.statusText || 'OK'
    responseHeaders.value = res.headers
    responseData.value = res.data
  } catch (err) {
    responseLatency.value = Math.round(performance.now() - startTime)
    if (err.response) {
      responseStatus.value = err.response.status
      responseStatusText.value = err.response.statusText || 'Error'
      responseHeaders.value = err.response.headers
      responseData.value = err.response.data
    } else {
      responseStatus.value = 0
      responseStatusText.value = 'Network Error'
      responseData.value = {
        success: false,
        message: err.message || 'Cannot reach backend server',
      }
    }
  } finally {
    executing.value = false
  }
}

function copyResponse() {
  if (!responseData.value) return
  navigator.clipboard.writeText(JSON.stringify(responseData.value, null, 2))
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function getMethodBadge(method) {
  switch (method) {
    case 'GET':
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
    case 'POST':
      return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
    case 'PATCH':
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
    case 'DELETE':
      return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Code2 class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Interactive API Explorer</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test and verify all 31 endpoints implemented in the Golang backend with real-time response inspection.
          </p>
        </div>
      </div>
    </div>

    <!-- Explorer Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left sidebar: List of Endpoints (4 cols) -->
      <div class="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col max-h-[750px] transition-colors duration-200">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Endpoints ({{ endpoints.length }})
          </span>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-1">
          <button
            v-for="ep in endpoints"
            :key="ep.id"
            type="button"
            @click="selectEndpoint(ep)"
            class="w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2 group"
            :class="[
              selectedEndpointId === ep.id
                ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
            ]"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border"
                  :class="getMethodBadge(ep.method)"
                >
                  {{ ep.method }}
                </span>
                <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate font-mono">
                  {{ ep.path }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {{ ep.description }}
              </p>
            </div>

            <span
              v-if="ep.adminOnly"
              class="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex-shrink-0"
            >
              Admin
            </span>
          </button>
        </div>
      </div>

      <!-- Right Panel: Runner & Live Response (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Request Builder Card -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
          <!-- Method & Path Display -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span
                class="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg border"
                :class="getMethodBadge(selectedEndpoint.method)"
              >
                {{ selectedEndpoint.method }}
              </span>
              <span class="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                {{ selectedEndpoint.path }}
              </span>
            </div>

            <button
              type="button"
              @click="executeRequest"
              :disabled="executing"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              <span
                v-if="executing"
                class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <Play v-else class="w-3.5 h-3.5 fill-current" />
              <span>{{ executing ? 'Executing...' : 'Send Request' }}</span>
            </button>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-400">
            {{ selectedEndpoint.description }}
          </p>

          <!-- Path parameter input if :id present -->
          <div v-if="selectedEndpoint.pathParam" class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Path Parameter: <code class="text-indigo-600 dark:text-indigo-400 font-mono">:id</code>
            </label>
            <input
              v-model="activePathId"
              type="number"
              min="1"
              class="w-32 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Query Parameters -->
          <div v-if="selectedEndpoint.params && selectedEndpoint.params.length > 0" class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Query Parameters</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div v-for="param in selectedEndpoint.params" :key="param.name" class="flex items-center gap-2">
                <span class="font-mono text-slate-500 dark:text-slate-400 text-[11px] w-24 truncate">{{ param.name }}:</span>
                <input
                  v-model="queryParams[param.name]"
                  type="text"
                  placeholder="value"
                  class="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <!-- JSON Body Editor (for POST/PATCH) -->
          <div v-if="selectedEndpoint.body">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Request Payload (JSON Body)
            </label>
            <textarea
              v-model="requestBody"
              rows="6"
              class="block w-full p-3 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 dark:bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Response Viewer Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Response
              </span>

              <!-- Status Code Badge -->
              <span
                v-if="responseStatus !== null"
                class="font-mono text-xs font-bold px-2 py-0.5 rounded-md"
                :class="[
                  responseStatus >= 200 && responseStatus < 300
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700',
                ]"
              >
                {{ responseStatus }} {{ responseStatusText }}
              </span>

              <!-- Latency -->
              <span v-if="responseLatency" class="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {{ responseLatency }}ms
              </span>
            </div>

            <button
              v-if="responseData"
              type="button"
              @click="copyResponse"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copied ? 'Copied!' : 'Copy JSON' }}</span>
            </button>
          </div>

          <div class="p-4 bg-slate-950 min-h-[220px]">
            <pre
              v-if="responseData"
              class="text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed"
            >{{ JSON.stringify(responseData, null, 2) }}</pre>

            <div
              v-else-if="executing"
              class="flex flex-col items-center justify-center py-16 text-slate-500 gap-2"
            >
              <div class="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-mono">Waiting for backend response...</span>
            </div>

            <div
              v-else
              class="flex flex-col items-center justify-center py-16 text-slate-600 text-xs text-center"
            >
              <Code2 class="w-8 h-8 text-slate-700 mb-2" />
              <p>Click "Send Request" above to execute this endpoint and inspect the live response.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

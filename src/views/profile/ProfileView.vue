<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import {
  UserCheck,
  Save,
  Mail,
  User,
  KeyRound,
  Shield,
  Calendar,
  Clock,
  IdCard,
} from 'lucide-vue-next'

const authStore = useAuthStore()

const loadingProfile = ref(true)
const saving = ref(false)

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formErrors = ref({})

onMounted(async () => {
  loadingProfile.value = true
  const profile = await authStore.fetchProfile()
  if (profile) {
    name.value = profile.name || ''
    email.value = profile.email || ''
  } else if (authStore.user) {
    name.value = authStore.user.name || ''
    email.value = authStore.user.email || ''
  }
  loadingProfile.value = false
})

async function handleUpdateProfile() {
  formErrors.value = {}

  if (!name.value || name.value.trim().length < 2) {
    formErrors.value.name = 'Name must be at least 2 characters'
  }
  if (!email.value) {
    formErrors.value.email = 'Email address is required'
  }
  if (password.value) {
    if (password.value.length < 6) {
      formErrors.value.password = 'New password must be at least 6 characters'
    }
    if (password.value !== confirmPassword.value) {
      formErrors.value.confirmPassword = 'Passwords do not match'
    }
  }

  if (Object.keys(formErrors.value).length > 0) return

  saving.value = true
  const payload = {
    name: name.value.trim(),
    email: email.value.trim(),
  }
  if (password.value) {
    payload.password = password.value
  }

  const res = await authStore.updateProfile(payload)
  saving.value = false

  if (res.success) {
    password.value = ''
    confirmPassword.value = ''
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
          {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {{ authStore.user?.name || 'User Profile' }}
            </h2>
            <StatusBadge :variant="authStore.isAdmin ? 'purple' : 'neutral'">
              <Shield v-if="authStore.isAdmin" class="w-3 h-3" />
              <User v-else class="w-3 h-3" />
              <span>{{ authStore.isAdmin ? 'Admin' : 'Regular User' }}</span>
            </StatusBadge>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal profile information and authentication credentials.
          </p>
        </div>
      </div>
    </div>

    <div v-if="loadingProfile" class="py-16">
      <LoadingSpinner text="Loading profile details..." />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Edit Profile Form (2 cols) -->
      <div class="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <UserCheck class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Edit Profile Details</span>
        </h3>

        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <!-- Name -->
          <div>
            <label for="prof-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User class="w-4 h-4" />
              </div>
              <input
                id="prof-name"
                v-model="name"
                type="text"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                :class="{ 'border-rose-400': formErrors.name }"
              />
            </div>
            <p v-if="formErrors.name" class="text-[11px] text-rose-500 mt-1">
              {{ formErrors.name }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="prof-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail class="w-4 h-4" />
              </div>
              <input
                id="prof-email"
                v-model="email"
                type="email"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                :class="{ 'border-rose-400': formErrors.email }"
              />
            </div>
            <p v-if="formErrors.email" class="text-[11px] text-rose-500 mt-1">
              {{ formErrors.email }}
            </p>
          </div>

          <!-- Password change section -->
          <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Change Password</h4>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mb-3">Leave blank if you do not want to change your password.</p>

            <div class="space-y-3">
              <div>
                <label for="prof-pass" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <KeyRound class="w-4 h-4" />
                  </div>
                  <input
                    id="prof-pass"
                    v-model="password"
                    type="password"
                    placeholder="Min 6 characters..."
                    class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    :class="{ 'border-rose-400': formErrors.password }"
                  />
                </div>
                <p v-if="formErrors.password" class="text-[11px] text-rose-500 mt-1">
                  {{ formErrors.password }}
                </p>
              </div>

              <div>
                <label for="prof-conf-pass" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <KeyRound class="w-4 h-4" />
                  </div>
                  <input
                    id="prof-conf-pass"
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Re-type new password..."
                    class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    :class="{ 'border-rose-400': formErrors.confirmPassword }"
                  />
                </div>
                <p v-if="formErrors.confirmPassword" class="text-[11px] text-rose-500 mt-1">
                  {{ formErrors.confirmPassword }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-4 flex justify-end">
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              <span
                v-if="saving"
                class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <Save v-else class="w-4 h-4" />
              <span>{{ saving ? 'Saving Changes...' : 'Save Profile' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Account Metadata Card (1 col) -->
      <div class="space-y-4">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200">
          <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Account Metadata
          </h3>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <IdCard class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>User ID</span>
              </span>
              <span class="font-mono font-bold text-slate-800 dark:text-slate-200">#{{ authStore.user?.id }}</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Shield class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Account Role</span>
              </span>
              <StatusBadge :variant="authStore.isAdmin ? 'purple' : 'neutral'">
                {{ authStore.isAdmin ? 'Admin' : 'User' }}
              </StatusBadge>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Registered On</span>
              </span>
              <span class="text-slate-700 dark:text-slate-300 text-right text-[11px]">
                {{ formatDate(authStore.user?.created_at) }}
              </span>
            </div>

            <div class="flex items-center justify-between py-1">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Last Updated</span>
              </span>
              <span class="text-slate-700 dark:text-slate-300 text-right text-[11px]">
                {{ formatDate(authStore.user?.updated_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserPlus, User, Mail, KeyRound } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formErrors = ref({})

async function handleRegister() {
  formErrors.value = {}

  if (!name.value || name.value.trim().length < 2) {
    formErrors.value.name = 'Name must be at least 2 characters'
  }
  if (!email.value) {
    formErrors.value.email = 'Email address is required'
  }
  if (!password.value || password.value.length < 6) {
    formErrors.value.password = 'Password must be at least 6 characters'
  }
  if (password.value !== confirmPassword.value) {
    formErrors.value.confirmPassword = 'Passwords do not match'
  }

  if (Object.keys(formErrors.value).length > 0) return

  const result = await authStore.register({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
  })

  if (result.success) {
    router.push({
      name: 'login',
      query: { registered: 'true' },
    })
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Create a new account</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Register an account to test user registration and todo management.
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-3.5">
      <!-- Full Name -->
      <div>
        <label for="name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Full Name
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <User class="w-4 h-4" />
          </div>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="John Doe"
            class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            :class="{ 'border-rose-400 focus:ring-rose-400': formErrors.name }"
          />
        </div>
        <p v-if="formErrors.name" class="text-[11px] text-rose-500 mt-1">
          {{ formErrors.name }}
        </p>
      </div>

      <!-- Email Address -->
      <div>
        <label for="reg-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Email Address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Mail class="w-4 h-4" />
          </div>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            required
            placeholder="john@example.com"
            class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            :class="{ 'border-rose-400 focus:ring-rose-400': formErrors.email }"
          />
        </div>
        <p v-if="formErrors.email" class="text-[11px] text-rose-500 mt-1">
          {{ formErrors.email }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label for="reg-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Password (min 6 characters)
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <KeyRound class="w-4 h-4" />
          </div>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            :class="{ 'border-rose-400 focus:ring-rose-400': formErrors.password }"
          />
        </div>
        <p v-if="formErrors.password" class="text-[11px] text-rose-500 mt-1">
          {{ formErrors.password }}
        </p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirm-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Confirm Password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <KeyRound class="w-4 h-4" />
          </div>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            :class="{ 'border-rose-400 focus:ring-rose-400': formErrors.confirmPassword }"
          />
        </div>
        <p v-if="formErrors.confirmPassword" class="text-[11px] text-rose-500 mt-1">
          {{ formErrors.confirmPassword }}
        </p>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition"
      >
        <span
          v-if="authStore.loading"
          class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        <UserPlus v-else class="w-4 h-4" />
        <span>{{ authStore.loading ? 'Creating Account...' : 'Register Account' }}</span>
      </button>
    </form>

    <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
      Already have an account?
      <RouterLink
        to="/auth/login"
        class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 ml-1"
      >
        Sign in
      </RouterLink>
    </div>
  </div>
</template>

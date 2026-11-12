<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn, KeyRound, Mail, UserCheck, Shield } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const formErrors = ref({})

// function setDemoCredentials(e, p) {
//   email.value = e
//   password.value = p
//   formErrors.value = {}
// }

async function handleLogin() {
  formErrors.value = {}
  if (!email.value) {
    formErrors.value.email = 'Email address is required'
  }
  if (!password.value) {
    formErrors.value.password = 'Password is required'
  }
  if (Object.keys(formErrors.value).length > 0) return

  const result = await authStore.login({
    email: email.value.trim(),
    password: password.value,
  })

  if (result.success) {
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Sign in to your account</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Authenticate using JWT to access protected endpoints.
      </p>
    </div>

    <!-- Quick Demo Accounts Helper -->
    <!-- <div class="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Quick Demo Accounts
        </span>
        <span class="text-[10px] text-slate-400 dark:text-slate-500">Default pass: password</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          @click="setDemoCredentials('admin@example.com', 'password')"
          class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left transition group"
        >
          <Shield class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div class="min-w-0">
            <div class="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Admin</div>
            <div class="text-[10px] text-slate-400 dark:text-slate-400 truncate">admin@example.com</div>
          </div>
        </button>

        <button
          type="button"
          @click="setDemoCredentials('user@example.com', 'password')"
          class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition group"
        >
          <UserCheck class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div class="min-w-0">
            <div class="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Test User</div>
            <div class="text-[10px] text-slate-400 dark:text-slate-400 truncate">user@example.com</div>
          </div>
        </button>

        <button
          type="button"
          @click="setDemoCredentials('shin@example.com', 'password')"
          class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left transition group"
        >
          <Shield class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div class="min-w-0">
            <div class="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Shin (Admin)</div>
            <div class="text-[10px] text-slate-400 dark:text-slate-400 truncate">shin@example.com</div>
          </div>
        </button>

        <button
          type="button"
          @click="setDemoCredentials('nao@example.com', 'password')"
          class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition group"
        >
          <UserCheck class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div class="min-w-0">
            <div class="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Nao (User)</div>
            <div class="text-[10px] text-slate-400 dark:text-slate-400 truncate">nao@example.com</div>
          </div>
        </button>
      </div>
    </div> -->

    <!-- Login Form -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Email Address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Mail class="w-4 h-4" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            :class="{ 'border-rose-400 focus:ring-rose-400': formErrors.email }"
          />
        </div>
        <p v-if="formErrors.email" class="text-[11px] text-rose-500 mt-1">
          {{ formErrors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <KeyRound class="w-4 h-4" />
          </div>
          <input
            id="password"
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
        <LogIn v-else class="w-4 h-4" />
        <span>{{ authStore.loading ? 'Authenticating...' : 'Sign In' }}</span>
      </button>
    </form>

    <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
      Don't have an account yet?
      <RouterLink
        to="/auth/register"
        class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 ml-1"
      >
        Create one now
      </RouterLink>
    </div>
  </div>
</template>

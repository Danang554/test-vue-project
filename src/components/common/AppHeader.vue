<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHealthStore } from '@/stores/health'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import {
  Activity,
  User,
  LogOut,
  Menu,
  Shield,
  Code2,
  RefreshCw,
  Database,
} from 'lucide-vue-next'

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()
const healthStore = useHealthStore()

onMounted(() => {
  healthStore.checkHealth()
})

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
    <div class="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Left side: Hamburger button & page contextual info -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle menu"
        >
          <Menu class="w-5 h-5" />
        </button>

        <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span class="font-medium text-slate-800 dark:text-slate-200">REST API Client</span>
          <span>&bull;</span>
          <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">v1.0.0</span>
        </div>
      </div>

      <!-- Right side: Health indicator, Theme Toggle & User menu -->
      <div class="flex items-center gap-2.5">
        <!-- Live Backend Health Indicator -->
        <button
          type="button"
          @click="healthStore.checkHealth"
          :title="`Click to recheck health (${healthStore.latency}ms)`"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition group"
          :class="[
            healthStore.isOnline === true
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/70'
              : healthStore.isOnline === false
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-950/70'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
          ]"
        >
          <span class="relative flex h-2 w-2">
            <span
              v-if="healthStore.isOnline === true"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2"
              :class="[
                healthStore.isOnline === true
                  ? 'bg-emerald-500'
                  : healthStore.isOnline === false
                  ? 'bg-rose-500'
                  : 'bg-slate-400',
              ]"
            ></span>
          </span>

          <span class="hidden md:inline font-mono">
            {{ healthStore.isOnline ? 'API Online' : 'API Offline' }}
          </span>

          <span v-if="healthStore.isOnline" class="hidden lg:inline text-[11px] opacity-75 font-mono">
            ({{ healthStore.latency }}ms)
          </span>

          <RefreshCw
            class="w-3 h-3 text-slate-400 group-hover:rotate-180 transition duration-300"
            :class="{ 'animate-spin': healthStore.checking }"
          />
        </button>

        <!-- API Explorer Quick Link -->
        <RouterLink
          to="/api-explorer"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 transition"
        >
          <Code2 class="w-3.5 h-3.5" />
          <span>API Explorer</span>
        </RouterLink>

        <!-- Dark / Light Theme Toggle -->
        <ThemeToggle />

        <!-- User profile pill & Logout -->
        <div class="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <RouterLink
            to="/profile"
            class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
              :class="[
                authStore.isAdmin
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-indigo-600 text-white shadow-xs',
              ]"
            >
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>

            <div class="hidden md:block text-left">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                  {{ authStore.user?.name || 'User' }}
                </span>
                <span
                  v-if="authStore.isAdmin"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
                >
                  <Shield class="w-2.5 h-2.5" />
                  Admin
                </span>
              </div>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 leading-none truncate max-w-[120px] block mt-0.5">
                {{ authStore.user?.email }}
              </span>
            </div>
          </RouterLink>

          <button
            type="button"
            @click="handleLogout"
            title="Log out"
            class="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            aria-label="Logout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHealthStore } from '@/stores/health'
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Trash2,
  Code2,
  UserCheck,
  Zap,
  Server,
  Database,
  X,
} from 'lucide-vue-next'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const route = useRoute()
const authStore = useAuthStore()
const healthStore = useHealthStore()

const navigationItems = computed(() => {
  const items = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Todos', path: '/todos', icon: CheckSquare },
    { name: 'Categories', path: '/categories', icon: FolderKanban },
    { name: 'Trash Bin', path: '/trash', icon: Trash2 },
  ]

  if (authStore.isAdmin) {
    items.push({
      name: 'User Management',
      path: '/users',
      icon: Users,
      badge: 'Admin',
    })
  }

  items.push(
    { name: 'API Explorer', path: '/api-explorer', icon: Code2, highlight: true },
    { name: 'My Profile', path: '/profile', icon: UserCheck },
  )

  return items
})

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div>
    <!-- Mobile overlay -->
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
      @click="emit('close')"
    ></div>

    <!-- Sidebar container -->
    <aside
      class="fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 dark:border-slate-800/80"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Brand header -->
      <div class="h-16 px-6 flex items-center justify-between border-b border-slate-800 dark:border-slate-800/80">
        <RouterLink to="/" class="flex items-center gap-3 group" @click="emit('close')">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
            <Zap class="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 class="font-bold text-sm tracking-tight text-white leading-none">
              GoTodo API
            </h1>
            <span class="text-[11px] font-medium text-slate-400">Frontend Client</span>
          </div>
        </RouterLink>

        <button
          type="button"
          @click="emit('close')"
          class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation links -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          @click="emit('close')"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group"
          :class="[
            isActive(item.path)
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : item.highlight
              ? 'text-indigo-300 hover:bg-indigo-950/50 hover:text-indigo-200'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
          ]"
        >
          <div class="flex items-center gap-3 min-w-0">
            <component
              :is="item.icon"
              class="w-4 h-4 flex-shrink-0 transition"
              :class="[
                isActive(item.path)
                  ? 'text-white'
                  : item.highlight
                  ? 'text-indigo-400'
                  : 'text-slate-400 group-hover:text-slate-200',
              ]"
            />
            <span class="truncate">{{ item.name }}</span>
          </div>

          <span
            v-if="item.badge"
            class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-500/20 text-purple-300 border border-purple-500/30"
          >
            {{ item.badge }}
          </span>

          <span
            v-else-if="item.highlight && !isActive(item.path)"
            class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          >
            Live
          </span>
        </RouterLink>
      </nav>

      <!-- Backend Info Box at Bottom -->
      <div class="p-4 border-t border-slate-800 dark:border-slate-800/80 bg-slate-950/40">
        <div class="p-3 rounded-xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/60 dark:border-slate-800 text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-300">
            <div class="flex items-center gap-1.5">
              <Server class="w-3.5 h-3.5 text-indigo-400" />
              <span class="font-medium">Backend</span>
            </div>
            <span
              class="inline-block w-2 h-2 rounded-full"
              :class="healthStore.isOnline ? 'bg-emerald-400' : 'bg-rose-400'"
            ></span>
          </div>

          <div class="text-[11px] text-slate-400 space-y-1">
            <div class="flex justify-between items-center">
              <span>Target BE:</span>
              <span class="font-mono text-slate-300 truncate max-w-[120px]" :title="healthStore.backendUrl">
                {{ healthStore.backendHost }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span>Database:</span>
              <span
                class="font-mono text-[10px] px-1.5 py-0.2 rounded"
                :class="[
                  healthStore.dbStatus === 'connected'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800',
                ]"
              >
                {{ healthStore.dbStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

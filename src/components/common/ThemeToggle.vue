<script setup>
import { useThemeStore } from '@/stores/theme'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <button
    type="button"
    @click="themeStore.toggleTheme"
    :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    class="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    aria-label="Toggle theme"
  >
    <Sun v-if="themeStore.isDark" class="w-4 h-4 text-amber-400" />
    <Moon v-else class="w-4 h-4 text-slate-600" />
  </button>
</template>

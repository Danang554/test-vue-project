<script setup>
import { Inbox } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'No items found',
  },
  description: {
    type: String,
    default: 'Try adjusting your search or create a new entry to get started.',
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
    <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
      <slot name="icon">
        <Inbox class="w-6 h-6" />
      </slot>
    </div>
    <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">{{ title }}</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">{{ description }}</p>
    <div>
      <slot name="action"></slot>
    </div>
  </div>
</template>

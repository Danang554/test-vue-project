<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
    default: () => ({ page: 1, limit: 10, total_items: 0, total_pages: 1 }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change-page', 'change-limit'])

const currentPage = computed(() => props.pagination?.page || 1)
const totalPages = computed(() => Math.max(props.pagination?.total_pages || 1, 1))
const totalItems = computed(() => props.pagination?.total_items || 0)
const currentLimit = computed(() => props.pagination?.limit || 10)

const fromItem = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * currentLimit.value + 1
})

const toItem = computed(() => {
  return Math.min(currentPage.value * currentLimit.value, totalItems.value)
})

function setPage(p) {
  if (p < 1 || p > totalPages.value || p === currentPage.value || props.loading) return
  emit('change-page', p)
}

function onLimitChange(e) {
  emit('change-limit', Number(e.target.value))
}
</script>

<template>
  <div
    v-if="totalItems > 0"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs text-slate-600 dark:text-slate-400 transition-colors duration-200"
  >
    <!-- Items counter & limit picker -->
    <div class="flex items-center gap-3">
      <span>
        Showing <strong class="text-slate-800 dark:text-slate-200">{{ fromItem }}</strong> -
        <strong class="text-slate-800 dark:text-slate-200">{{ toItem }}</strong> of
        <strong class="text-slate-800 dark:text-slate-200">{{ totalItems }}</strong> items
      </span>

      <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
        <label for="limit-select" class="text-slate-500 dark:text-slate-400">Per page:</label>
        <select
          id="limit-select"
          :value="currentLimit"
          @change="onLimitChange"
          :disabled="loading"
          class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Navigation buttons -->
    <div class="flex items-center gap-1">
      <button
        type="button"
        @click="setPage(currentPage - 1)"
        :disabled="currentPage <= 1 || loading"
        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft class="w-4 h-4" />
        <span class="hidden sm:inline">Prev</span>
      </button>

      <span class="px-3 py-1 font-medium text-slate-700 dark:text-slate-200">
        {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        type="button"
        @click="setPage(currentPage + 1)"
        :disabled="currentPage >= totalPages || loading"
        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <span class="hidden sm:inline">Next</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

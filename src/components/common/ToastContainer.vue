<script setup>
import { useToastStore } from '@/stores/toast'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-vue-next'

const toastStore = useToastStore()

function getIcon(type) {
  switch (type) {
    case 'success':
      return CheckCircle2
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
}

function getStyle(type) {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
    case 'error':
      return 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
    default:
      return 'bg-sky-50 dark:bg-sky-950/90 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-100'
  }
}

function getIconStyle(type) {
  switch (type) {
    case 'success':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'error':
      return 'text-rose-600 dark:text-rose-400'
    case 'warning':
      return 'text-amber-600 dark:text-amber-400'
    default:
      return 'text-sky-600 dark:text-sky-400'
  }
}
</script>

<template>
  <div
    class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
  >
    <TransitionGroup
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-colors"
        :class="getStyle(toast.type)"
      >
        <component
          :is="getIcon(toast.type)"
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          :class="getIconStyle(toast.type)"
        />

        <div class="flex-1 min-w-0">
          <h4 v-if="toast.title" class="text-sm font-semibold mb-0.5">
            {{ toast.title }}
          </h4>
          <p class="text-xs leading-relaxed opacity-90 break-words">
            {{ toast.message }}
          </p>

          <!-- Validation error details if present -->
          <div
            v-if="toast.details && typeof toast.details === 'object'"
            class="mt-2 text-xs bg-white/60 dark:bg-black/30 rounded p-2 border border-black/5 dark:border-white/10 space-y-1"
          >
            <div
              v-for="(val, field) in toast.details"
              :key="field"
              class="flex items-start gap-1"
            >
              <span class="font-medium capitalize text-slate-700 dark:text-slate-300">{{ field }}:</span>
              <span class="text-slate-600 dark:text-slate-400">{{ val }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="toastStore.removeToast(toast.id)"
          class="flex-shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1 -mr-1 -mt-1 rounded-lg"
          aria-label="Close"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { AlertTriangle, Trash2 } from 'lucide-vue-next'
import ModalDialog from './ModalDialog.vue'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed with this action?',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  variant: {
    type: String,
    default: 'danger', // danger, warning, primary
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const variantBtnClasses = {
  danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
}

const variantIconClasses = {
  danger: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
  warning: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
  primary: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
}
</script>

<template>
  <ModalDialog :show="show" :title="title" maxWidth="max-w-md" @close="emit('cancel')">
    <div class="flex items-start gap-4">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="variantIconClasses[variant] || variantIconClasses.danger"
      >
        <Trash2 v-if="variant === 'danger'" class="w-5 h-5" />
        <AlertTriangle v-else class="w-5 h-5" />
      </div>

      <div class="flex-1">
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ message }}
        </p>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        @click="emit('cancel')"
        :disabled="loading"
        class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
      >
        {{ cancelText }}
      </button>

      <button
        type="button"
        @click="emit('confirm')"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 transition"
        :class="variantBtnClasses[variant] || variantBtnClasses.danger"
      >
        <span
          v-if="loading"
          class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        {{ confirmText }}
      </button>
    </template>
  </ModalDialog>
</template>

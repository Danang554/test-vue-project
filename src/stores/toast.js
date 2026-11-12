import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function addToast({ type = 'info', title = '', message = '', details = null, duration = 4000 }) {
    const id = Date.now() + Math.random().toString(36).substring(2, 9)
    const toast = { id, type, title, message, details, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    return id
  }

  function success(message, title = 'Success', duration = 3500) {
    return addToast({ type: 'success', title, message, duration })
  }

  function error(message, title = 'Error', details = null, duration = 5000) {
    return addToast({ type: 'error', title, message, details, duration })
  }

  function warning(message, title = 'Warning', duration = 4000) {
    return addToast({ type: 'warning', title, message, duration })
  }

  function info(message, title = 'Information', duration = 3500) {
    return addToast({ type: 'info', title, message, duration })
  }

  function removeToast(id) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  return {
    toasts,
    addToast,
    success,
    error,
    warning,
    info,
    removeToast,
  }
})

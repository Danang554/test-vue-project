import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useThemeStore } from './stores/theme'
import { logFrontendError } from './utils/logger'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// 1. Tangkap error komponen Vue di frontend
app.config.errorHandler = (err, instance, info) => {
  const component =
    instance?.$options?.name ||
    instance?._?.type?.__name ||
    'UnknownComponent'
  logFrontendError(err, { component, info })
}

// 2. Tangkap error runtime JavaScript di browser (window.onerror)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Hanya tangkap error JavaScript client
    if (event.error || event.message) {
      logFrontendError(event.error || event.message, {
        file: event.filename,
        line: event.lineno,
        col: event.colno,
      })
    }
  })

  // 3. Tangkap unhandled Promise rejection di frontend
  window.addEventListener('unhandledrejection', (event) => {
    // Abaikan jika error berasal dari response Axios backend (karena BE Golang sudah menyimpan log-nya sendiri)
    if (event.reason?.isAxiosError || event.reason?.response) {
      return
    }
    logFrontendError(event.reason, { type: 'unhandled_promise' })
  })
}

// Initialize theme immediately
const themeStore = useThemeStore()
themeStore.applyTheme()

app.mount('#app')

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Muat semua environment variables dari file .env
  const env = loadEnv(mode, process.cwd(), '')

  // Port Frontend dinamis dari .env (default: 5173)
  const port = parseInt(env.VITE_PORT || env.PORT || '5173', 10)

  // URL / Domain Backend dinamis dari .env (default: http://127.0.0.1:8080)
  const rawBackend = env.VITE_BACKEND_URL || env.VITE_API_BASE_URL || 'http://127.0.0.1:8080'
  const backendTarget = rawBackend.replace(/\/+$/, '')

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port,
      host: true, // Memungkinkan akses dari localhost maupun IP LAN lokal
      proxy: {
        '/health': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port,
    },
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { healthApi } from '@/api/health'
import { getBackendUrl, getBackendHost } from '@/api/client'

export const useHealthStore = defineStore('health', () => {
  const isOnline = ref(null) // null = unknown, true = online, false = offline
  const dbStatus = ref('unknown')
  const appName = ref('')
  const latency = ref(0)
  const lastChecked = ref(null)
  const checking = ref(false)

  const backendUrl = computed(() => getBackendUrl())
  const backendHost = computed(() => getBackendHost())

  async function checkHealth() {
    checking.value = true
    const startTime = performance.now()
    try {
      const res = await healthApi.checkHealth()
      latency.value = Math.round(performance.now() - startTime)
      isOnline.value = true
      lastChecked.value = new Date()

      if (res.data && res.data.data) {
        appName.value = res.data.data.app_name || 'Golang API'
        dbStatus.value = res.data.data.database || 'unknown'
      }
      return { success: true, latency: latency.value, data: res.data }
    } catch (err) {
      latency.value = Math.round(performance.now() - startTime)
      isOnline.value = false
      dbStatus.value = 'unreachable'
      lastChecked.value = new Date()
      return { success: false, latency: latency.value, error: err }
    } finally {
      checking.value = false
    }
  }

  return {
    isOnline,
    dbStatus,
    appName,
    latency,
    lastChecked,
    checking,
    backendUrl,
    backendHost,
    checkHealth,
  }
})

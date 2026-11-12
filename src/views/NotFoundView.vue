<script setup>
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center transition-colors duration-200">
    <div class="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-7 h-7" />
      </div>
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">404</h1>
      <h2 class="text-base font-semibold text-slate-700 dark:text-slate-200 mt-1">Page Not Found</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
        The route you are looking for doesn't exist or has been relocated.
      </p>

      <RouterLink
        to="/"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Return to Dashboard</span>
      </RouterLink>
    </div>
  </div>
</template>

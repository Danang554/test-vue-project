<script setup>
import ToastContainer from '@/components/common/ToastContainer.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { Zap } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-slate-900 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
    <!-- Theme Toggle at top right -->
    <div class="absolute top-4 right-4 z-20">
      <div class="bg-slate-800/80 rounded-xl p-0.5 border border-slate-700">
        <ThemeToggle />
      </div>
    </div>

    <!-- Background glow decoration -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <div class="flex justify-center">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
          <Zap class="w-7 h-7 fill-current" />
        </div>
      </div>
      <h2 class="mt-4 text-center text-2xl font-bold tracking-tight text-white">
        Golang API Client
      </h2>
      <p class="mt-1 text-center text-xs text-slate-400">
        Single Page Application testbed for Golang REST endpoints
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <div class="bg-white dark:bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <RouterView />
      </div>
    </div>

    <!-- Global Toast Container -->
    <ToastContainer />
  </div>
</template>

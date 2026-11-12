<script setup>
defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  text: {
    type: String,
    default: '',
  },
})

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-6">
    <div
      class="animate-spin rounded-full border-indigo-600 border-t-transparent"
      :class="sizeMap[size] || sizeMap.md"
    ></div>
    <span v-if="text" class="text-xs font-medium text-slate-500">
      {{ text }}
    </span>
  </div>
</template>

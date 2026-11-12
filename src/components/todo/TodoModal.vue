<script setup>
import { ref, watch } from 'vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import { CheckSquare, Save } from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  todo: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const title = ref('')
const description = ref('')
const categoryId = ref('')
const isCompleted = ref(false)
const errors = ref({})

watch(
  () => props.todo,
  (t) => {
    if (t) {
      title.value = t.title || ''
      description.value = t.description || ''
      categoryId.value = t.category_id || t.category?.id || ''
      isCompleted.value = !!t.is_completed
    } else {
      title.value = ''
      description.value = ''
      categoryId.value = ''
      isCompleted.value = false
    }
    errors.value = {}
  },
  { immediate: true },
)

function handleSubmit() {
  errors.value = {}
  if (!title.value || title.value.trim().length < 2) {
    errors.value.title = 'Title must be at least 2 characters'
  }
  if (title.value && title.value.length > 255) {
    errors.value.title = 'Title must not exceed 255 characters'
  }

  if (Object.keys(errors.value).length > 0) return

  const payload = {
    id: props.todo ? props.todo.id : null,
    title: title.value.trim(),
    description: description.value ? description.value.trim() : null,
    category_id: categoryId.value ? Number(categoryId.value) : null,
  }

  if (props.todo) {
    payload.is_completed = isCompleted.value
  }

  emit('save', payload)
}
</script>

<template>
  <ModalDialog
    :show="show"
    :title="todo ? 'Edit Todo' : 'Create New Todo'"
    maxWidth="max-w-md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" id="todo-form" class="space-y-4">
      <!-- Title -->
      <div>
        <label for="todo-title" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Todo Title <span class="text-rose-500">*</span>
        </label>
        <input
          id="todo-title"
          v-model="title"
          type="text"
          required
          placeholder="e.g. Finish quarterly presentation"
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          :class="{ 'border-rose-400': errors.title }"
        />
        <p v-if="errors.title" class="text-[11px] text-rose-500 mt-1">
          {{ errors.title }}
        </p>
      </div>

      <!-- Category selection -->
      <div>
        <label for="todo-category" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Category (Optional)
        </label>
        <select
          id="todo-category"
          v-model="categoryId"
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="">-- No Category --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label for="todo-desc" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="todo-desc"
          v-model="description"
          rows="3"
          placeholder="Additional notes or subtasks..."
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
        ></textarea>
      </div>

      <!-- Completed Checkbox (when editing) -->
      <div v-if="todo" class="flex items-center gap-2 pt-1">
        <input
          id="todo-completed"
          v-model="isCompleted"
          type="checkbox"
          class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
        />
        <label for="todo-completed" class="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
          Mark as completed
        </label>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="emit('close')"
        :disabled="loading"
        class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        form="todo-form"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
      >
        <span
          v-if="loading"
          class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        <Save v-else-if="todo" class="w-3.5 h-3.5" />
        <CheckSquare v-else class="w-3.5 h-3.5" />
        <span>{{ todo ? 'Save Changes' : 'Create Todo' }}</span>
      </button>
    </template>
  </ModalDialog>
</template>

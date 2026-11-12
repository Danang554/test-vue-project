<script setup>
import { ref, watch } from 'vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import { FolderPlus, Save } from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const name = ref('')
const description = ref('')
const errors = ref({})

watch(
  () => props.category,
  (cat) => {
    if (cat) {
      name.value = cat.name || ''
      description.value = cat.description || ''
    } else {
      name.value = ''
      description.value = ''
    }
    errors.value = {}
  },
  { immediate: true },
)

function handleSubmit() {
  errors.value = {}
  if (!name.value || name.value.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }
  if (name.value && name.value.length > 100) {
    errors.value.name = 'Name must not exceed 100 characters'
  }
  if (description.value && description.value.length > 255) {
    errors.value.description = 'Description must not exceed 255 characters'
  }

  if (Object.keys(errors.value).length > 0) return

  emit('save', {
    id: props.category ? props.category.id : null,
    name: name.value.trim(),
    description: description.value ? description.value.trim() : '',
  })
}
</script>

<template>
  <ModalDialog
    :show="show"
    :title="category ? 'Edit Category' : 'Create New Category'"
    maxWidth="max-w-md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" id="category-form" class="space-y-4">
      <div>
        <label for="cat-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Category Name <span class="text-rose-500">*</span>
        </label>
        <input
          id="cat-name"
          v-model="name"
          type="text"
          required
          placeholder="e.g. Work, Personal, Project Alpha"
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          :class="{ 'border-rose-400': errors.name }"
        />
        <p v-if="errors.name" class="text-[11px] text-rose-500 mt-1">
          {{ errors.name }}
        </p>
      </div>

      <div>
        <label for="cat-desc" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="cat-desc"
          v-model="description"
          rows="3"
          placeholder="Short description for this category..."
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          :class="{ 'border-rose-400': errors.description }"
        ></textarea>
        <p v-if="errors.description" class="text-[11px] text-rose-500 mt-1">
          {{ errors.description }}
        </p>
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
        form="category-form"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
      >
        <span
          v-if="loading"
          class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        <Save v-else-if="category" class="w-3.5 h-3.5" />
        <FolderPlus v-else class="w-3.5 h-3.5" />
        <span>{{ category ? 'Save Changes' : 'Create Category' }}</span>
      </button>
    </template>
  </ModalDialog>
</template>

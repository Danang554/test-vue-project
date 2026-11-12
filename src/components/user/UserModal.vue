<script setup>
import { ref, watch } from 'vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import { UserPlus, Save, Shield } from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  user: {
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
const email = ref('')
const password = ref('')
const isAdmin = ref(false)
const errors = ref({})

watch(
  () => props.user,
  (u) => {
    if (u) {
      name.value = u.name || ''
      email.value = u.email || ''
      password.value = ''
      isAdmin.value = !!u.is_admin
    } else {
      name.value = ''
      email.value = ''
      password.value = ''
      isAdmin.value = false
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
  if (!email.value) {
    errors.value.email = 'Email address is required'
  }
  if (!props.user && (!password.value || password.value.length < 6)) {
    errors.value.password = 'Password is required and must be at least 6 characters'
  }
  if (props.user && password.value && password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (Object.keys(errors.value).length > 0) return

  const payload = {
    id: props.user ? props.user.id : null,
    name: name.value.trim(),
    email: email.value.trim(),
    is_admin: isAdmin.value,
  }

  if (password.value) {
    payload.password = password.value
  }

  emit('save', payload)
}
</script>

<template>
  <ModalDialog
    :show="show"
    :title="user ? 'Edit User' : 'Create New User'"
    maxWidth="max-w-md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" id="user-form" class="space-y-4">
      <!-- Full Name -->
      <div>
        <label for="user-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Full Name <span class="text-rose-500">*</span>
        </label>
        <input
          id="user-name"
          v-model="name"
          type="text"
          required
          placeholder="Jane Doe"
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          :class="{ 'border-rose-400': errors.name }"
        />
        <p v-if="errors.name" class="text-[11px] text-rose-500 mt-1">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email Address -->
      <div>
        <label for="user-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Email Address <span class="text-rose-500">*</span>
        </label>
        <input
          id="user-email"
          v-model="email"
          type="email"
          required
          placeholder="jane@example.com"
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          :class="{ 'border-rose-400': errors.email }"
        />
        <p v-if="errors.email" class="text-[11px] text-rose-500 mt-1">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label for="user-password" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Password <span v-if="!user" class="text-rose-500">*</span>
          <span v-else class="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>
        </label>
        <input
          id="user-password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          :class="{ 'border-rose-400': errors.password }"
        />
        <p v-if="errors.password" class="text-[11px] text-rose-500 mt-1">
          {{ errors.password }}
        </p>
      </div>

      <!-- Is Admin Switch -->
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-2">
          <Shield class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <div>
            <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">Admin Privileges</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">Allow this user to manage other users</div>
          </div>
        </div>
        <input
          id="user-isadmin"
          v-model="isAdmin"
          type="checkbox"
          class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
        />
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
        form="user-form"
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
      >
        <span
          v-if="loading"
          class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        <Save v-else-if="user" class="w-3.5 h-3.5" />
        <UserPlus v-else class="w-3.5 h-3.5" />
        <span>{{ user ? 'Save Changes' : 'Create User' }}</span>
      </button>
    </template>
  </ModalDialog>
</template>

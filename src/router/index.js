import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { logFrontendError } from '@/utils/logger'

import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { title: 'Sign In' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { title: 'Create Account' },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'todos',
        name: 'todos',
        component: () => import('@/views/todos/TodosView.vue'),
        meta: { title: 'Todos' },
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/categories/CategoriesView.vue'),
        meta: { title: 'Categories' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/users/UsersView.vue'),
        meta: { title: 'User Management', requiresAdmin: true },
      },
      {
        path: 'trash',
        name: 'trash',
        component: () => import('@/views/trash/TrashView.vue'),
        meta: { title: 'Trash Bin' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: 'My Profile' },
      },
      {
        path: 'api-explorer',
        name: 'api-explorer',
        component: () => import('@/views/api-explorer/ApiExplorerView.vue'),
        meta: { title: 'API Explorer' },
      },
    ],
  },
  {
    path: '/login',
    redirect: '/auth/login',
  },
  {
    path: '/register',
    redirect: '/auth/register',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const toast = useToastStore()

  // Update page document title
  const appTitle = import.meta.env.VITE_APP_TITLE || 'API Frontend'
  document.title = to.meta.title ? `${to.meta.title} | ${appTitle}` : appTitle

  // Check authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath !== '/' ? to.fullPath : undefined },
    }
  }

  if (guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (requiresAdmin && !authStore.isAdmin) {
    toast.warning('Access denied: Administrator privileges required.')
    return { name: 'dashboard' }
  }
})

// Tangkap error navigasi atau kegagalan load chunk komponen di router
router.onError((error) => {
  logFrontendError(error, { type: 'router_error' })
})

export default router

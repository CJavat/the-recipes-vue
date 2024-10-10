import { authRoutes } from '@/modules/auth/routes'
import { dashboardRoutes } from '@/modules/dashboard/routes'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    authRoutes,
    dashboardRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

export default router

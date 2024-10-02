import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
  // beforeEnter: [isNotAuthenticatedGuard],
  redirect: { name: 'login' },
  component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
  children: [
    {
      path: 'login',
      name: 'login',
      component: () => import('@/modules/auth/views/LoginView.vue')
    },
    {
      path: 'register',
      name: 'register',
      component: () => import('@/modules/auth/views/RegisterView.vue')
    },
    {
      path: 'forgot-password',
      name: 'forgot-password',
      component: () => import('@/modules/auth/views/ForgotPasswordView.vue')
    },
    {
      path: 'reactivate-account',
      name: 'reactivate-account',
      component: () => import('@/modules/auth/views/ReactivateAccountView.vue')
    },
    {
      path: 'update-password/:token',
      name: 'update-password/',
      component: () => import('@/modules/auth/views/UpdateForgotVuew.vue')
    }
  ]
}

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { AuthStatus } from '../interfaces'

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  await authStore.checkAuthStatus()

  authStore.authStatus === AuthStatus.Unauthenticated ? next({ name: 'auth' }) : next()
}

export default isAuthenticatedGuard

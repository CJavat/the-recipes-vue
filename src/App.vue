<template>
  <div v-if="authStore.isChecking" class="w-full min-h-screen flex justify-center items-center">
    <Spinner class="w-40" />
  </div>

  <RouterView v-else />
</template>

<script lang="ts" setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './modules/auth/stores/auth.store'

import Spinner from './modules/common/components/Spinner.vue'
import { AuthStatus } from './modules/auth/interfaces'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

authStore.$subscribe(
  (mutation, state) => {
    console.log(state.authStatus)
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus()
      return
    }

    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'home' })
      return
    }
  },
  {
    immediate: true
  }
)
</script>

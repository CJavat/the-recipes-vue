<template>
  <div class="min-h-screen flex flex-col">
    <Navbar :image-user="avatar" />

    <main class="bg-sky-50 dark:bg-sky-950 grow px-5 w-full flex flex-col pb-10">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useRouter } from 'vue-router'
import Navbar from '@/modules/dashboard/components/Navbar.vue'
import Footer from '@/modules/dashboard/components/Footer.vue'

import type { ImageUser } from '../interfaces'
import { AuthStatus } from '@/modules/auth/interfaces'

const router = useRouter()
const authStore = useAuthStore()

const backendUrl: string = import.meta.env.VITE_RECIPES_API_URL
const avatar = reactive<ImageUser>({
  src: '',
  alt: ''
})

onMounted(() => {
  if (authStore.authStatus === AuthStatus.Unauthenticated) {
    authStore.logout()
    router.replace('/auth')
    return
  }

  avatar.alt = authStore.user!.firstName + authStore.user!.lastName
  if (avatar.src.startsWith('http')) {
    avatar.src = authStore.user!.avatar
  } else {
    avatar.src = `${backendUrl.replace('/api', '')}/${authStore.user!.avatar}`
  }
})
</script>

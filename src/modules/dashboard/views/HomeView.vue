<template>
  <h1>Home Page</h1>
  <button class="border border-red-500 text-red-500 p-5 w-fit rounded-md" @click="onLogout">
    Cerrar Sesión
  </button>
  <p>
    {{ JSON.stringify(userRef, null, 3) }}
  </p>
</template>

<script lang="ts" setup>
//TODO: Terminar de Implementar
import type { User } from '@/modules/auth/interfaces'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const userRef = ref<User>()

onMounted(() => {
  userRef.value = authStore.user
})

const onLogout = () => {
  authStore.logout()
  router.replace('/auth')
}
</script>

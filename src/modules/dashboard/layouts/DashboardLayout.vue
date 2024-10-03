<template>
  <div class="min-h-screen flex flex-col">
    <!-- 
    //TODO: Terminar de implementar.
    <Navbar image-user="http://localhost:3000/no-user-image.jpg" />
    -->

    <main class="bg-sky-50 dark:bg-sky-950 grow px-5 w-full flex flex-col pb-10">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
// import { useAuthStore } from '@/modules/auth/stores/auth.store'

// import Navbar from '@/modules/dashboard/components/Navbar.vue'
import Footer from '@/modules/dashboard/components/Footer.vue'

export interface ImageUser {
  src: string
  alt: string
}

// const { user, logout } = useAuthStore()

// const backendUrl: string = import.meta.env.VITE_RECIPES_API_URL
// const avatar = reactive<ImageUser>({
//   src: '',
//   alt: ''
// })

//TODO: Terminar de implementar.
// onMounted(() => {
//   if(!user?.firstName || !user?.lastName || !user?.avatar) {
// logout();
//     return;
//   }

//   avatar.src = user!.avatar
//   avatar.alt = user!.firstName + user!.lastName

//   console.log(backendUrl.replace('/api', ''))

// }),
</script>

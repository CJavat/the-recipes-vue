<template>
  <div class="pt-7">
    <div class="px-4 sm:px-0 border-b border-b-sky-300 dark:border-b-sky-900">
      <h3 class="text-2xl text-black dark:text-white mb-3">Actualizar Foto</h3>
    </div>

    <div
      class="mt-6 w-full md:max-w-7xl container mx-auto flex flex-col justify-center items-center"
    >
      <div v-if="!isLoading" class="px-4 py-6 sm:px-0">
        <AdvancedCropper
          class="w-full md:w-96 h-96"
          ref="imageCropperRef"
          @file-selected="updatePhoto"
        />

        <button
          :disabled="isLoading"
          @click="openFileInputInChild"
          type="button"
          class="h-36 w-36 md:h-56 md:w-56 inline-block relative rounded-full border border-sky-500"
        >
          <img
            :src="imageProfile"
            alt="Foto de perfil"
            class="h-36 w-36 md:h-56 md:w-56 object-scale-down rounded-full"
          />

          <span
            class="absolute inset-0 flex items-center justify-center text-white font-semibold bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
            >Cambiar foto de perfil</span
          >
        </button>
      </div>

      <div v-else class="px-4 py-6 sm:px-0">
        <Spinner class="h-36 w-36 md:h-56 md:w-56" />
      </div>

      <span class="md:hidden text-sky-950 dark:text-sky-50 font-bold text-2xl"
        >Cambiar foto de perfil</span
      >

      <span class="hidden md:block text-sky-950 dark:text-sky-50 font-bold text-xl"
        >Selecciona la foto para cambiarla</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useUserStore } from '../stores'

import AdvancedCropper from '../components/AdvancedCropper.vue'
import Swal from 'sweetalert2'
import Spinner from '@/modules/common/components/Spinner.vue'

const authStore = useAuthStore()
const userStore = useUserStore()

const backendUrl: string = import.meta.env.VITE_RECIPES_API_URL
const isLoading = ref<boolean>(false)
const imageProfile = ref<string>()
const imageCropperRef = ref<InstanceType<typeof AdvancedCropper> | null>(null)

onMounted(() => {
  if (authStore.user?.avatar.startsWith('http')) {
    imageProfile.value = authStore.user!.avatar
  } else {
    imageProfile.value = `${backendUrl.replace('/api', '')}/${authStore.user!.avatar}`
  }
})

const updatePhoto = async (file: File) => {
  isLoading.value = true

  const formData = new FormData()
  formData.append('file', file)

  try {
    const user = await userStore.updatePhoto(formData)
    authStore.updateUser(user)

    Swal.fire(
      'Imagen Actualizada',
      'La imagen de perfil ha sido actualizada correctamente',
      'success'
    ).then(() => {
      location.reload()
    })
  } catch (error) {
    console.log(error)
    Swal.fire('Error', 'No se pudo actualizar tu imagen', 'error')
  } finally {
    isLoading.value = false
  }
}

const openFileInputInChild = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openFileDialog()
  }
}
</script>

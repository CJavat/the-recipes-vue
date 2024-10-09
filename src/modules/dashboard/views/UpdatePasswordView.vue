<template>
  <form class="divide-y divide-sky-300 dark:divide-sky-900" @submit.prevent="onSubmit">
    <div class="md:px-4 md:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm font-medium leading-6 text-black dark:text-white">Contraseña</dt>
      <input
        v-model="myForm.password"
        id="password"
        name="password"
        type="password"
        class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
        required
      />
      <span v-if="formErrors.password" class="text-red-500"> La contraseña es inválida </span>
    </div>

    <div class="my-5 md:px-4 md:py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm font-medium leading-6 text-black dark:text-white">Repetir Contraseña</dt>
      <input
        v-model="myForm.rePassword"
        id="rePassword"
        name="rePassword"
        type="password"
        class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
        required
      />
      <span v-if="formErrors.rePassword" class="text-red-500">
        Las contraseñas deben ser iguales
      </span>
    </div>

    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <button
        :disabled="isLoadingRef"
        type="submit"
        class="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <Spinner v-if="isLoadingRef" class="w-6" />
        <span v-else>Actualizar Contraseña</span>
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useUserStore } from '../stores'

import Swal from 'sweetalert2'
import Spinner from '../../common/components/Spinner.vue'

import type { User } from '@/modules/auth/interfaces'

const isLoadingRef = ref<boolean>(false)
const router = useRouter()

const authStore = useAuthStore()
const userStore = useUserStore()

const user = ref<User>()
const myForm = reactive({
  password: '',
  rePassword: ''
})
const formErrors = reactive({
  password: false,
  rePassword: false
})

onMounted(() => {
  user.value = authStore.user
})

const onSubmit = async () => {
  isLoadingRef.value = true

  try {
    if (!user.value?.id) return
    if (myForm.password.length < 6) return (formErrors.password = true)
    formErrors.password = false
    if (myForm.rePassword !== myForm.password) return (formErrors.rePassword = true)
    formErrors.rePassword = false

    const resp = await userStore.updateProfile(user.value!.id, { password: myForm.password })

    Swal.fire('Cuenta Actualizada', 'La contraseña se actualizó correctamente', 'success').then(
      () => router.replace({ name: 'login' })
    )
  } catch (error) {
    console.error(error)
    Swal.fire('Error', error as string, 'error')
  } finally {
    isLoadingRef.value = false
  }
}
</script>

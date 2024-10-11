<template>
  <div class="pt-7">
    <div>
      <div class="px-4 sm:px-0">
        <h3 class="text-2xl text-black dark:text-white mb-3">Mi Cuenta</h3>
      </div>

      <div class="mt-6 border-t border-t-sky-300 dark:border-t-sky-900">
        <form class="divide-y divide-sky-300 dark:divide-sky-900" @submit.prevent="onSubmit">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Nombre</dt>
            <input
              v-model="myForm.firstName"
              id="firstName"
              name="firstName"
              type="text"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
              required
            />
            <span v-if="formErrors.firstName" class="text-red-500"> El nombre es inválido </span>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Apellido</dt>
            <input
              v-model="myForm.lastName"
              id="lastName"
              name="lastName"
              type="text"
              autocomplete="email"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
              required
            />
            <span v-if="formErrors.lastName" class="text-red-500"> El apellido es inválido </span>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <button
              :disabled="isLoading"
              type="submit"
              class="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Spinner v-if="isLoading" class="w-6" />
              <span v-else>Actualizar Cuenta </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

import Swal from 'sweetalert2'
import Spinner from '@/modules/common/components/Spinner.vue'

import type { User } from '@/modules/auth/interfaces'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const isLoading = ref<boolean>(false)
const user = ref<User>()

const myForm = reactive({
  firstName: '',
  lastName: ''
})

const formErrors = reactive({
  firstName: false,
  lastName: false
})

onMounted(() => {
  user.value = authStore.user ?? undefined
  if (!user.value) {
    router.replace('/dashboard')
    return
  }

  myForm.firstName = user.value.firstName
  myForm.lastName = user.value.lastName
})

const onSubmit = async () => {
  isLoading.value = true
  try {
    if (!user.value) return

    if (myForm.firstName === '') return (formErrors.firstName = true)
    formErrors.firstName = false
    if (myForm.lastName === '') return (formErrors.lastName = true)
    formErrors.lastName = false

    const response = await userStore.updateProfile(user.value.id, myForm)
    authStore.updateUser(response)

    Swal.fire('Usuario Actualizado', 'Tu perfil se ha actualizado correctamente', 'success').then(
      () => router.replace('/dashboard/my-account')
    )

    return
  } catch (error) {
    console.log(error)
    Swal.fire('Error', error as string, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

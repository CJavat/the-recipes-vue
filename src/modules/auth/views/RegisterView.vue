<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="absolute sm:relative sm:mx-auto top-0 left-0 h-20 sm:h-28 w-auto rounded-2xl"
        src="/android-chrome-512x512.png"
        alt="The Recipes Logo"
      />
      <h2
        class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-sky-950 dark:text-sky-50"
      >
        Crear Cuenta
      </h2>
    </div>

    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" novalidate @submit.prevent="onSubmit">
        <div>
          <label
            for="firstName"
            class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
            >Nombre</label
          >
          <div class="mt-2">
            <input
              v-model="myForm.firstName"
              id="firstName"
              name="firstName"
              type="text"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
            />
            <span v-if="formErrors.firstName" class="text-red-500"> El nombre es inválido </span>
          </div>
        </div>

        <div>
          <label
            for="lastName"
            class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
            >Apellido</label
          >
          <div class="mt-2">
            <input
              v-model="myForm.lastName"
              id="lastName"
              name="lastName"
              type="text"
              autocomplete="email"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
            />
            <span v-if="formErrors.lastName" class="text-red-500"> El apellido es inválido </span>
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
            >Email</label
          >
          <div class="mt-2">
            <input
              v-model="myForm.email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
            />
            <span v-if="formErrors.email" class="text-red-500"> El email es inválido </span>
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
            >Contraseña</label
          >

          <div class="mt-2">
            <input
              v-model="myForm.password"
              id="password"
              name="password"
              type="password"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
            />
            <span v-if="formErrors.password" class="text-red-500"> La contraseña es inválida </span>
          </div>
        </div>

        <div>
          <label
            for="re-password"
            class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
            >Repite tu Contraseña</label
          >

          <div class="mt-2">
            <input
              v-model="myForm.rePassword"
              id="rePassword"
              name="rePassword"
              type="password"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
            />
            <span v-if="formErrors.rePassword" class="text-red-500">
              Las contraseñas deben ser iguales
            </span>
          </div>
        </div>

        <div>
          <button
            :disabled="isLoadingRef"
            type="submit"
            class="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Spinner v-if="isLoadingRef" class="w-6" />
            <span v-else>Registrarse</span>
          </button>
        </div>
      </form>

      <p class="mt-5 text-center text-sm text-gray-500 px-10 sm:px-16">
        ¿Ya tienes cuenta?
        <RouterLink
          :to="{ name: 'login' }"
          class="font-semibold leading-6 text-sky-700 hover:text-sky-500"
          >Inicia sesión aquí.</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

import Swal from 'sweetalert2'
import Spinner from '../../common/components/Spinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoadingRef = ref<boolean>(false)

const myForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  rePassword: ''
})

const formErrors = reactive({
  firstName: false,
  lastName: false,
  email: false,
  password: false,
  rePassword: false
})

const onSubmit = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isLoadingRef.value = true

  try {
    if (myForm.firstName === '') return (formErrors.firstName = true)
    formErrors.firstName = false
    if (myForm.lastName === '') return (formErrors.lastName = true)
    formErrors.lastName = false
    if (!emailRegex.test(myForm.email)) return (formErrors.email = true)
    formErrors.email = false
    if (myForm.password.length < 6) return (formErrors.password = true)
    formErrors.password = false
    if (myForm.rePassword !== myForm.password) return (formErrors.rePassword = true)
    formErrors.rePassword = false

    const message = await authStore.register(myForm)

    Swal.fire('Registro exitoso!', message, 'success').then(() => router.replace({ name: 'login' }))

    return
  } catch (error) {
    console.error(error)
    Swal.fire('Error', error as string, 'error')
  } finally {
    isLoadingRef.value = false
  }
}
</script>

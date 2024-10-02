<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-28 w-auto rounded-2xl"
        src="/android-chrome-512x512.png"
        alt="The Recipes Logo"
      />
      <h2
        class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-sky-950 dark:text-sky-50"
      >
        Iniciar Sesión
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" novalidate @submit.prevent="onSubmit">
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
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
              >Contraseña</label
            >
            <div class="text-sm">
              <RouterLink
                :to="{ name: 'forgot-password' }"
                class="font-semibold text-sky-700 hover:text-sky-500"
                >¿Olvidaste tu contraseña?</RouterLink
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="myForm.password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
            />

            <span v-if="formErrors.password" class="text-red-500">
              El password debe tener más de 6 caracteres
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
            <span v-else>Ingresar</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        ¿Aún no estás registrado?
        <RouterLink
          :to="{ name: 'register' }"
          class="font-semibold leading-6 text-sky-700 hover:text-sky-500"
          >Crea una cuenta gratis aquí.</RouterLink
        >
      </p>

      <p class="mt-2 text-center text-sm text-gray-500">
        ¿Tu cuenta no está activa?
        <RouterLink
          :to="{ name: 'reactivate-account' }"
          class="font-semibold leading-6 text-sky-700 hover:text-sky-500"
          >Actívala aquí.</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Spinner from '../../common/components/Spinner.vue'

const isLoadingRef = ref<boolean>(false)

const myForm = reactive({
  email: '',
  password: ''
})

const formErrors = reactive({
  email: false,
  password: false
})

const onSubmit = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isLoadingRef.value = true

  try {
    if (!emailRegex.test(myForm.email)) return (formErrors.email = true)
    formErrors.email = false
    if (myForm.password.length < 6) return (formErrors.password = true)
    formErrors.password = false

    //TODO: Enviar la petición al Store.
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingRef.value = false
  }
}
</script>

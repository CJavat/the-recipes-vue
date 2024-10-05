<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8 min-w-96">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-28 w-auto rounded-2xl"
        src="/android-chrome-512x512.png"
        alt="The Recipes Logo"
      />
      <h2
        class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-sky-950 dark:text-sky-50"
      >
        Actualizar Contraseña
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
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
              autocomplete="password"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
              required
            />
            <span v-if="formErrors.password" class="text-red-500"> La contraseña es inválida</span>
          </div>
        </div>

        <div>
          <label
            for="rePassword"
            class="block text-sm font-medium leading-6 text-sky-950 dark:text-sky-50"
            >Confirma Tu Contraseña</label
          >
          <div class="mt-2">
            <input
              v-model="myForm.rePassword"
              id="rePassword"
              name="rePassword"
              type="password"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
              required
            />

            <span v-if="formErrors.rePassword" class="text-red-500">
              Las contraseñas deben coincidir
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
            <span v-else>Actualizar Contraseña</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import Swal from 'sweetalert2'
import Spinner from '../../common/components/Spinner.vue'

const isLoadingRef = ref<boolean>(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const token = route.fullPath.split('/').slice(-1)[0]

const myForm = reactive({
  password: '',
  rePassword: ''
})

const formErrors = reactive({
  password: false,
  rePassword: false
})

const onSubmit = async () => {
  isLoadingRef.value = true

  try {
    if (myForm.password.length < 6) return (formErrors.password = true)
    formErrors.password = false
    if (myForm.rePassword !== myForm.password) return (formErrors.rePassword = true)
    formErrors.rePassword = false

    const message = await authStore.updatePassword(token, myForm.password)

    Swal.fire('Cuenta Actualizada', message, 'success').then(() =>
      router.replace({ name: 'login' })
    )
  } catch (error) {
    console.error(error)
    Swal.fire('Error', error as string, 'error')
  } finally {
    isLoadingRef.value = false
  }
}
</script>

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
        Activar Cuenta
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
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
              required
            />

            <span v-if="formErrors.email" class="text-red-500"> El email es inválido </span>
          </div>
        </div>

        <div>
          <button
            :disabled="isLoadingRef"
            type="submit"
            class="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Spinner v-if="isLoadingRef" class="w-6" />
            <span v-else>Reactivar Cuenta</span>
          </button>
        </div>
      </form>
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
  email: ''
})

const formErrors = reactive({
  email: false
})

const onSubmit = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isLoadingRef.value = true

  try {
    if (!emailRegex.test(myForm.email)) return (formErrors.email = true)
    formErrors.email = false

    const message = await authStore.reactivateAccount(myForm.email)

    Swal.fire('Cuenta Reactivada!', message, 'success').then(() =>
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

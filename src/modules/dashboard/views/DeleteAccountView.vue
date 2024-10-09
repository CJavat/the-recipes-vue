<template>
  <h3 class="text-4xl text-sky-950 dark:text-slate-50">¡Cuidado!</h3>

  <p class="text-red-500 my-5">
    Estas a punto de eliminar tu cuenta o cancelar tu cuenta temporalmente, ten en cuenta que todos
    tus datos, recetas y favoritos seran eliminados permanentemente.
  </p>

  <p class="text-sky-950 dark:text-slate-50">Selecciona un botón</p>

  <div>
    <button
      @click="cancelAccount"
      class="uppercase col-span-3 md:col-span-1 mt-5 flex w-full justify-center rounded-md border border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Dar de baja mi cuenta
    </button>
  </div>

  <div>
    <button
      @click="deleteAccount"
      class="uppercase col-span-3 md:col-span-1 mt-5 flex w-full justify-center rounded-md border border-red-600 hover:bg-red-500 text-red-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Borrar Cuenta
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useUserStore } from '../stores'

import Swal from 'sweetalert2'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const isLoading = ref<boolean>(false)

const cancelAccount = async () => {
  isLoading.value = true

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      Swal.fire('Error Al Cancelar Tu Cuenta', 'Tu token es inválido, intentalo más tarde', 'error')
      return
    }

    await userStore.cancelAccount()

    authStore.logout()
    Swal.fire('Cuenta Cancelada', 'Tu cuenta se canceló correctamente', 'success').then(() =>
      router.replace('/auth')
    )
  } catch (error) {
    console.error('Error:', error)
    Swal.fire(
      'Error Al Cancelar Tu Cuenta',
      'Ha ocurrido un error al cancelar tu cuenta, intentalo más tarde',
      'error'
    )
  } finally {
    isLoading.value = false
  }
}

const deleteAccount = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      Swal.fire('Error Al Cancelar Tu Cuenta', 'Tu token es inválido, intentalo más tarde', 'error')
      return
    }

    await userStore.deleteAccount()

    authStore.logout()

    Swal.fire(
      'Cuenta Eliminada Permanentemente',
      'Tu cuenta ha sido eliminada exitosamente',
      'success'
    ).then(() => router.replace('/auth'))
  } catch (error) {
    console.error('Error:', error)
    Swal.fire(
      'Error Al Cancelar Tu Cuenta',
      'Ha ocurrido un error al cancelar tu cuenta, intentalo más tarde',
      'error'
    )
  } finally {
    isLoading.value = false
  }
}
</script>

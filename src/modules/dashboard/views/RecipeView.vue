<template>
  <div
    v-if="!isLoading"
    class="grid grid-cols-1 md:grid-cols-12 gap-2 text-sky-950 dark:text-sky-50"
  >
    <div class="col-span-12 md:col-span-6 flex flex-col justify-center items-center my-5 md:my-0">
      <div class="relative">
        <button class="absolute right-0 z-10" @click="toggleSubmit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ef4444"
            :class="[
              'w-10 md:w-14 transition-colors duration-300 hover:fill-red-500',
              {
                'fill-red-500': isFavorite
              }
            ]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        <img
          :src="imageUrl"
          :alt="recipe?.title"
          class="w-52 h-52 md:w-64 md:h-64 mb-5 object-cover rounded-lg border-4 border-sky-200 dark:border-sky-900"
        />
      </div>

      <div class="w-full md:w-fit text-start sm:text-center md:text-start">
        <RouterLink
          :to="`/dashboard/category/${recipe?.Category?.id}`"
          class="text-sky-500 hover:text-sky-600 text-md"
        >
          {{ recipe?.Category?.name }}
        </RouterLink>

        <p class="text-md">
          Creado el
          {{ formattedDate(recipe?.createdAt ?? new Date()) }}
        </p>

        <p class="text-sm">
          Autor:
          <RouterLink
            :to="`/dashboard/recipes-by-user/${recipe?.User?.id}`"
            class="text-sky-500 hover:text-sky-600"
          >
            {{ recipe?.User?.firstName }} {{ recipe?.User?.lastName }}
          </RouterLink>
        </p>

        <RouterLink
          v-if="isMyRecipe"
          :to="`/dashboard/edit-recipe/${recipe?.id}`"
          class="uppercase col-span-3 md:col-span-1 mt-5 flex w-full justify-center rounded-md border border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Editar Receta
        </RouterLink>

        <button
          v-if="isMyRecipe"
          @click="deleteRecipe"
          class="uppercase col-span-3 md:col-span-1 mt-5 flex w-full justify-center rounded-md border border-red-600 hover:bg-red-500 text-red-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Eliminar Receta
        </button>
      </div>
    </div>

    <div class="col-span-12 md:col-span-6">
      <div class="my-5">
        <h3 class="my-2 text-2xl md:text-4xl text-sky-950 dark:text-sky-50">
          {{ recipe?.title }}
        </h3>

        <p class="text-gray-800 dark:text-gray-300">
          {{ recipe?.description }}
        </p>
      </div>

      <div>
        <h5 class="text-xl md:text-3xl text-sky-400 my-2">Ingredientes</h5>
        <ul class="flex flex-col px-3">
          <li v-for="(ingredient, index) in recipe?.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>

      <div class="my-3">
        <h5 class="text-xl md:text-3xl text-sky-400 my-2">Pasos</h5>
        <ul class="flex flex-col px-3 gap-2">
          <li v-for="(step, index) in recipe?.steps" :key="index" class="leading-5">
            {{ index + 1 }}.- {{ step }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="h-96 flex justify-center items-center">
    <Spinner class="w-32 md:w-56" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { formattedDate } from '@/modules/common/helpers'

import Swal from 'sweetalert2'
import Spinner from '@/modules/common/components/Spinner.vue'

import type { Recipe } from '../interfaces'
import type { User } from '@/modules/auth/interfaces'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const backendUrl: string = import.meta.env.VITE_RECIPES_API_URL
const isLoading = ref<boolean>(false)
const recipe = ref<Recipe>()
const recipeId = ref<string>()
const currentUser = ref<User>()
const imageUrl = ref<string>()
const isFavorite = ref<boolean>(false)
const isMyRecipe = ref<boolean>(false)

onMounted(() => {
  currentUser.value = authStore.user
  recipeId.value = route.fullPath.split('/').slice(-1)[0] ?? ''
  if (recipeId.value.includes('?')) {
    recipeId.value = recipeId.value.split('?')[0]
  }

  isFavorite.value = recipeStore.myFavorites
    ? recipeStore.myFavorites.some((fav) => fav.id === recipeId.value)
    : false

  getRecipe()
})

const getRecipe = async () => {
  isLoading.value = true

  try {
    if (recipeId.value === undefined) return
    const recipeResponse = await recipeStore.getRecipe(recipeId.value)

    recipe.value = recipeResponse
    isMyRecipe.value = recipe.value?.User?.id === currentUser.value?.id

    if (recipe.value.image.includes('http')) {
      imageUrl.value = recipe.value.image
    } else {
      imageUrl.value = `${backendUrl.replace('/api', '')}/${recipe.value.image}`
    }
  } catch (error) {
    console.log(error)
    recipe.value = undefined

    router.push({ path: '/dashboard' })
  } finally {
    isLoading.value = false
  }
}

const deleteRecipe = async () => {
  isLoading.value = true
  try {
    if (!recipe.value?.id) return

    const { message } = await recipeStore.deleteRecipe(recipe.value.id)
    Swal.fire('Receta Eliminada', message ?? 'Se eliminó la receta correctamente', 'success').then(
      () => router.replace('/dashboard')
    )
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const toggleSubmit = () => {
  if (!recipe.value) return

  isFavorite.value = !isFavorite.value

  isFavorite.value ? addFavorite(recipe.value.id) : removeFavorite(recipe.value.id)
}

const addFavorite = async (id: string) => {
  if (!id) return

  try {
    await recipeStore.addFavorite(id)
  } catch (error) {
    console.log(error)
    Swal.fire('Error', error as string, 'error')
  }
}

const removeFavorite = async (id: string) => {
  if (!id) return

  try {
    await recipeStore.removeFavorite(id)
  } catch (error) {
    console.log(error)
    Swal.fire('Error', error as string, 'error')
  }
}
</script>

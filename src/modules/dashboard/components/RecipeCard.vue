<template>
  <div class="relative md:w-60 md:h-60 md:my-16">
    <RouterLink :to="`/dashboard/recipe/${recipe.id}`" class="flex md:flex-col gap-4">
      <img
        :src="imageUrl"
        :alt="recipe!.title"
        class="w-20 h-20 md:w-60 md:h-60 border rounded-md object-cover md:opacity-80"
      />

      <div class="flex flex-col justify-evenly h-20 w-6/12 md:w-full">
        <p class="text-sm md:text-xl text-black dark:text-white">
          {{ recipe!.title }}
        </p>
        <span class="text-xs md:text-sm text-sky-900 dark:text-sky-300">{{
          recipe!.User.firstName
        }}</span>
      </div>
    </RouterLink>

    <button class="absolute top-0 right-0" @click="toggleSubmit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#ef4444"
        :class="[
          'w-10 md:w-14 transition-colors duration-300 hover:fill-red-500',
          { 'fill-red-500': recipe?.isFavorite }
        ]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { CardRecipe } from '../interfaces'
import { useRecipeStore } from '../stores'
import Swal from 'sweetalert2'

const backendUrl: string = import.meta.env.VITE_RECIPES_API_URL.replace('/api', '')
const imageUrl = ref<string>('')

const recipeStore = useRecipeStore()

const props = defineProps<{ recipe: CardRecipe }>()

onMounted(() => {
  if (props.recipe?.image.includes('http')) {
    imageUrl.value = props.recipe.image
  } else {
    imageUrl.value = `${backendUrl}/${props.recipe?.image}`
  }
})

const toggleSubmit = () => {
  if (!props.recipe) return

  props.recipe.isFavorite = !props.recipe.isFavorite

  props.recipe.isFavorite ? addFavorite(props.recipe.id) : removeFavorite(props.recipe.id)
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

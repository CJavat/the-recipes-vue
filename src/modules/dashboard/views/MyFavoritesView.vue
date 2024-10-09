<template>
  <div v-if="!isLoading">
    <h3 class="text-2xl text-black dark:text-white mb-3">Recetas Favoritas</h3>

    <div v-if="!isLoading">
      <div
        v-if="favorites && favorites.length > 0"
        class="grid gap-5 min-w-full grid-cols-1 md:grid-cols-3 xl:grid-cols-4"
      >
        <RecipeCard v-for="(favorite, index) in favorites" :key="index" :recipe="favorite" />
      </div>
      <p
        v-else
        class="border border-red-500 text-red-500 rounded-md text-center p-2 w-fit mx-auto my-16"
      >
        No hay recetas para mostrar
      </p>
    </div>
    <div v-else class="h-96 flex justify-center items-center">
      <Spinner class="w-32" />
    </div>
  </div>

  <div v-else class="h-96 flex justify-center items-center">
    <Spinner class="w-32 md:w-56" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRecipeStore } from '../stores'
import RecipeCard from '../components/RecipeCard.vue'

import Spinner from '@/modules/common/components/Spinner.vue'

import type { CardRecipe } from '../interfaces'

const recipeStore = useRecipeStore()

const isLoading = ref<boolean>(false)
const favorites = ref<CardRecipe[]>()

onMounted(() => {
  isLoading.value = true
  favorites.value = recipeStore.myFavorites
  isLoading.value = false
})
</script>

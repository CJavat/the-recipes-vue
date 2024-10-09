<template>
  <div v-if="!isLoading">
    <div class="w-full flex justify-center items-center p-0">
      <AddRecipe class="my-5 cursor-pointer" />
    </div>

    <div v-if="!isLoading" class="px-5">
      <h3 class="text-2xl text-black dark:text-white mb-3">Recetas</h3>
      <div
        v-if="recipes && recipes.length > 0"
        class="grid gap-5 grid-cols-1 md:grid-cols-3 xl:grid-cols-4"
      >
        <RecipeCard v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" />
      </div>

      <p v-else class="border border-red-500 text-red-500 rounded-md text-center p-2">
        No hay recetas para mostrar
      </p>
    </div>

    <div v-else class="h-96 flex justify-center items-center">
      <Spinner class="w-32" />
    </div>

    <Pagination
      class="mt-16"
      :limit="limit"
      :currentPage="currentPage"
      :finalPage="finalPage"
      route="/dashboard/recipes"
      v-if="recipes?.length ?? 0 > 0"
    />
  </div>

  <div v-else class="h-96 flex justify-center items-center">
    <Spinner class="w-32 md:w-56" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { AxiosError } from 'axios'

import AddRecipe from '../components/AddRecipe.vue'
import Pagination from '../components/Pagination.vue'
import Spinner from '@/modules/common/components/Spinner.vue'
import RecipeCard from '../components/RecipeCard.vue'

import type { CardRecipe, FavoriteResponse } from '../interfaces'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const isLoading = ref<boolean>(false)
const recipes = ref<CardRecipe[]>()

const limit = ref<number>(6)
const offset = ref<number>(0)
const currentPage = ref<number>(1)
const finalPage = ref<number>(2)

onMounted(() => {
  limit.value = Number((route.query['limit'] as string) ?? 6)
  offset.value = Number((route.query['offset'] as string) ?? 0)

  currentPage.value = Math.floor(offset.value / limit.value) + 1

  getRecipes(limit.value, (currentPage.value - 1) * limit.value)
})

const getRecipes = async (limit: number, offset: number) => {
  isLoading.value = true
  isNaN(offset) ? (offset = 0) : offset
  try {
    const [recipesResponse, favoritesResponse] = await Promise.all([
      recipeStore.getRecipes(limit, offset),
      recipeStore.getFavorites()
    ])

    const { recipes: fetchedRecipes, totalPages } = recipesResponse

    recipes.value = fetchedRecipes.map((recipe) => ({
      ...recipe,
      id: recipe.id,
      image: recipe.image,
      title: recipe.title,
      User: {
        firstName: recipe.User.firstName
      },
      isFavorite: favoritesResponse.some((fav: FavoriteResponse) => fav.recipeId === recipe.id)
    }))

    console.log(totalPages)
    finalPage.value = totalPages
  } catch (error) {
    console.log(error)
    recipes.value = []
    if (error instanceof AxiosError && error.response?.data.statusCode === 401) {
      authStore.logout()
      return router.replace({ path: '/auth/login' })
    }

    router.push({ path: '/dashboard' })
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.query,
  () => {
    limit.value = Number((route.query['limit'] as string) ?? 4)
    offset.value = Number((route.query['offset'] as string) ?? 0)
    getRecipes(limit.value, offset.value)

    currentPage.value = Math.floor(offset.value / limit.value) + 1
  }
)
</script>

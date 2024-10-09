<template>
  <div class="px-5">
    <h3 class="text-2xl md:text-5xl text-black dark:text-white py-5 md:mb-5">Mis Recetas</h3>

    <div v-if="!isLoading">
      <div v-if="recipes && recipes!.length > 0">
        <div class="grid gap-5 grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
          <RecipeCard v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" />
        </div>

        <Pagination
          class="mt-16"
          :limit="limit"
          :currentPage="currentPage"
          :finalPage="finalPage"
          route="/dashboard/auth/my-recipes"
          v-if="recipes?.length ?? 0 > 0"
        />
      </div>
      <p v-else class="border border-red-500 text-red-500 rounded-md text-center p-2">
        No has creado recetas
      </p>
    </div>
    <div v-else class="h-96 flex justify-center items-center">
      <Spinner class="w-32" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { AxiosError } from 'axios'

import Spinner from '@/modules/common/components/Spinner.vue'
import RecipeCard from '../components/RecipeCard.vue'
import Pagination from '../components/Pagination.vue'

import type { CardRecipe } from '../interfaces'

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
    const recipesResponse = await recipeStore.getMyRecipes(limit, offset)

    const { recipes: fetchedRecipes, totalPages } = recipesResponse

    recipes.value = fetchedRecipes.map((recipe) => ({
      ...recipe,
      id: recipe.id,
      image: recipe.image,
      title: recipe.title,
      User: {
        firstName: recipe.User.firstName
      },
      isFavorite: recipeStore.myFavorites?.some((fav: CardRecipe) => fav.id === recipe.id) ?? false
    }))

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
</script>

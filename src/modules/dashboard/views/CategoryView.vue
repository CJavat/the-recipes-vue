<template>
  <div class="flex-1 px-5 min-h-screen">
    <h3 class="text-2xl md:text-5xl text-black dark:text-white py-5 md:mb-5">
      {{ currentCategory?.name }}
    </h3>

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
          :route="`/dashboard/category/${categoryId}`"
          v-if="recipes?.length ?? 0 > 0"
        />
      </div>
      <p v-else class="border border-red-500 text-red-500 rounded-md text-center p-2">
        No hay recetas para mostrar
      </p>
    </div>

    <div v-else class="h-96 flex justify-center items-center">
      <Spinner class="w-32 md:w-56" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipeStore } from '../stores'

import RecipeCard from '../components/RecipeCard.vue'
import Pagination from '../components/Pagination.vue'
import Spinner from '@/modules/common/components/Spinner.vue'

import type { CardRecipe, CategoryResponse } from '../interfaces'

const route = useRoute()
const recipeStore = useRecipeStore()

const categoryId = ref<string>()
const currentCategory = ref<CategoryResponse>()
const isLoading = ref<boolean>(false)
const recipes = ref<CardRecipe[]>()

const limit = ref<number>(6)
const offset = ref<number>(0)
const currentPage = ref<number>(1)
const finalPage = ref<number>(2)

onMounted(() => {
  categoryId.value = route.fullPath.split('/').slice(-1)[0] ?? ''
  if (categoryId.value.includes('?')) {
    categoryId.value = categoryId.value.split('?')[0]
  }

  currentCategory.value = recipeStore.categories?.filter(
    (category) => category.id === categoryId.value
  )[0]

  limit.value = Number((route.query['limit'] as string) ?? 6)
  offset.value = Number((route.query['offset'] as string) ?? 0)

  currentPage.value = Math.floor(offset.value / limit.value) + 1

  getRecipesByCategory(categoryId.value, limit.value, offset.value)
})

const getRecipesByCategory = async (id: string, limit: number, offset: number) => {
  isLoading.value = true
  isNaN(offset) ? (offset = 0) : offset
  try {
    const recipesResponse = await recipeStore.getRecipesByCategory(id, limit, offset)

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
  } finally {
    isLoading.value = false
  }
}
</script>

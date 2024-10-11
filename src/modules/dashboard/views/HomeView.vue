<template>
  <div class="pt-5 flex flex-col">
    <div v-if="!isLoading">
      <div class="px-5 hidden md:block">
        <h3 class="text-2xl text-black dark:text-white mb-3">Categorías</h3>
        <div class="text-xs grid grid-cols-5 xl:grid-cols-5 gap-3">
          <RouterLink
            v-for="(category, index) in categories"
            :key="index"
            :to="`/dashboard/category/${category.id}`"
            class="bg-sky-200 hover:bg-sky-300 px-5 py-2 rounded-full text-center"
          >
            {{ category.name }}
          </RouterLink>
        </div>
      </div>

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
        route="/dashboard"
        v-if="recipes?.length ?? 0 > 0"
      />
    </div>

    <div v-else class="h-96 flex justify-center items-center">
      <Spinner class="w-52" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores'
import { useAuthStore } from '../../auth/stores/auth.store'
import { AxiosError } from 'axios'

import Swal from 'sweetalert2'
import RecipeCard from '../components/RecipeCard.vue'
import AddRecipe from '../components/AddRecipe.vue'
import Spinner from '@/modules/common/components/Spinner.vue'
import Pagination from '../components/Pagination.vue'

import type { CardRecipe, CategoryResponse, FavoriteResponse } from '../interfaces'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const isLoading = ref<boolean>(false)
const recipes = ref<CardRecipe[]>()
const categories = ref<CategoryResponse[]>()

const limit = ref<number>(6)
const offset = ref<number>(0)
const currentPage = ref<number>(1)
const finalPage = ref<number>(2)

onMounted(() => {
  if (!authStore.user) {
    authStore.logout()
    router.replace('/auth/login')
    return
  }

  getCategories()

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

    finalPage.value = totalPages
  } catch (error) {
    // console.log(error)
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

const getCategories = async () => {
  isLoading.value = true

  try {
    const categoriesResponse = await recipeStore.getCategories()
    categories.value = categoriesResponse
  } catch (error) {
    // console.log(error)
    Swal.fire('Error: Categorías', 'Hubó un error al obtener las categorías', 'error')
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

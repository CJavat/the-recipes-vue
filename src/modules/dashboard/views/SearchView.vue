<template>
  <div class="flex-1 px-5 min-h-screen">
    <h3 class="text-2xl md:text-5xl text-black dark:text-white py-5 md:mb-5">
      Resultados encontrados con: {{ searchQuery }}
    </h3>

    <div v-if="!isLoading">
      <div
        v-if="recipes && recipes!.length > 0"
        class="grid gap-5 grid-cols-1 md:grid-cols-3 xl:grid-cols-4"
      >
        <RecipeCard v-for="(item, index) in recipes" :key="index" :recipe="item" />
      </div>
      <p v-else class="border border-red-500 text-red-500 rounded-md text-center p-2">
        No hay recetas para mostrar
      </p>
    </div>

    <div v-else class="self-center w-full flex justify-center items-center">
      <Spinner class="w-40" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipeStore } from '../stores'
import Swal from 'sweetalert2'
import RecipeCard from '../components/RecipeCard.vue'
import Spinner from '@/modules/common/components/Spinner.vue'
import type { CardRecipe } from '../interfaces'

const route = useRoute()
const recipeStore = useRecipeStore()

const searchQuery = ref<string>()
const recipes = ref<CardRecipe[]>()
const isLoading = ref<boolean>(false)

onMounted(() => {
  searchQuery.value = route.query['q'] as string
  searchRecipe(searchQuery.value)
})

const searchRecipe = async (title: string) => {
  isLoading.value = true
  try {
    const recipesResponse = await recipeStore.searchRecipes(title)

    recipes.value = recipesResponse.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      User: {
        firstName: recipe.User.firstName
      },
      isFavorite: recipeStore.myFavorites?.some((fav) => fav.id === recipe.id) ?? false
    }))

    console.log(recipes.value)
  } catch (error) {
    // console.log(error)
    Swal.fire('Error', error as string, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

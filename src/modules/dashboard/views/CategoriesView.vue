<template>
  <div v-if="!isLoadingRef">
    <h3 class="text-2xl text-black dark:text-white mb-10">Categorías</h3>
    <div class="text-xs md:text-lg grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
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

  <div v-else class="h-96 flex justify-center items-center">
    <Spinner class="w-28 md:w-52" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRecipeStore } from '../stores'

import Swal from 'sweetalert2'
import Spinner from '@/modules/common/components/Spinner.vue'

import type { CategoryResponse } from '../interfaces'

const recipeStore = useRecipeStore()

const isLoadingRef = ref<boolean>(false)
const categories = ref<CategoryResponse[]>()

onMounted(() => {
  getCategories()
})

const getCategories = async () => {
  isLoadingRef.value = true

  try {
    const categoriesResponse = await recipeStore.getCategories()
    categories.value = categoriesResponse
  } catch (error) {
    console.log(error)
    categories.value = []
    Swal.fire('Error', error as string, 'error')
  } finally {
    isLoadingRef.value = false
  }
}
</script>

<template>
  <div class="pt-7">
    <div>
      <div class="px-4 sm:px-0">
        <h3 class="text-2xl text-black dark:text-white mb-3">Actualizar {{ recipe?.title }}</h3>
      </div>

      <div class="mt-6 border-t border-t-sky-300 dark:border-t-sky-900">
        <form class="divide-y divide-sky-300 dark:divide-sky-900" @submit.prevent="onSubmit">
          <!-- Imagen -->
          <div class="px-4 py-6 grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center grid-cols-2">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Avatar</dt>
            <dd class="mt-1 text-sm leading-6 text-sky-950 dark:text-sky-300 sm:mt-0">
              <div class="px-4 py-6 sm:px-0">
                <AdvancedCropper
                  class="w-full md:w-96 h-96"
                  ref="imageCropperRef"
                  @file-selected="onFileChange"
                />

                <button
                  @click="openFileInputInChild"
                  type="button"
                  class="h-36 w-36 md:h-56 md:w-56 relative flex items-center justify-center border rounded-full border-sky-950 dark:border-sky-500"
                >
                  <div>
                    <img
                      v-if="imagePreview || imageUrl"
                      :src="imagePreview ? imagePreview : imageUrl"
                      :alt="`${myForm.title}`"
                      class="h-36 w-36 md:h-56 md:w-56 rounded-full"
                    />
                    <span
                      class="absolute inset-0 flex items-center justify-center text-white font-semibold bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                      >Cambiar Foto De Receta</span
                    >
                  </div>
                </button>
              </div>
            </dd>
          </div>

          <!-- Título -->
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Título</dt>
            <div>
              <input
                v-model="myForm.title"
                id="title"
                name="title"
                type="text"
                class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
                required
              />
              <span v-if="formErrors.title" class="text-red-500"> El título es inválido </span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Descripción</dt>
            <textarea
              v-model="myForm.description"
              id="description"
              name="description"
              class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
              cols="50"
            ></textarea>
          </div>

          <!-- Ingredientes -->
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Ingredientes</dt>

            <ul>
              <li
                v-for="(ingredient, index) in myForm.ingredients"
                :key="index"
                class="flex justify-center items-center gap-2"
              >
                <input
                  v-model="myForm.ingredients[index]"
                  required
                  placeholder="Escribe un ingrediente"
                  class="my-2 block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  class="flex-1 w-20 uppercase h-fit rounded-md border border-red-600 hover:bg-red-500 text-red-500 hover:text-red-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  @click="removeIngredient(index)"
                >
                  X
                </button>
              </li>
              <span v-if="formErrors.ingredients" class="text-red-500">
                Los ingredientes son obligatorios
              </span>
            </ul>
            <button
              type="button"
              class="uppercase mt-5 md:my-2 w-full h-fit rounded-md border border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              @click="addIngredient"
            >
              Agregar Ingrediente
            </button>
          </div>

          <!-- Pasos -->
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Pasos</dt>

            <ul>
              <li
                v-for="(step, index) in myForm.steps"
                :key="index"
                class="flex justify-center items-center gap-2"
              >
                <input
                  v-model="myForm.steps[index]"
                  required
                  placeholder="Escribe un paso"
                  class="my-2 block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  class="flex-1 w-20 uppercase h-fit rounded-md border border-red-600 hover:bg-red-500 text-red-500 hover:text-red-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  @click="removeStep(index)"
                >
                  X
                </button>
              </li>
              <span v-if="formErrors.steps" class="text-red-500"> Los pasos son obligatorios </span>
            </ul>
            <button
              type="button"
              class="uppercase mt-5 md:my-2 w-full h-fit rounded-md border border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              @click="addStep"
            >
              Agregar Paso
            </button>
          </div>

          <!-- Categorias -->
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-black dark:text-white">Categoria</dt>
            <div>
              <select
                v-model="myForm.category"
                name="category"
                id="category"
                class="block w-full rounded-md border-0 pl-3 py-1.5 text-sky-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option v-for="(category, index) in categories" :key="index" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <span v-if="formErrors.category" class="text-red-500">
                La categoría es obligatoria
              </span>
            </div>
          </div>

          <!-- Botón Submit -->
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <button
              :disabled="isLoading"
              type="submit"
              class="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Spinner v-if="isLoading" class="w-6" />
              <span v-else>Actualizar Receta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores'

import Spinner from '@/modules/common/components/Spinner.vue'
import AdvancedCropper from '../components/AdvancedCropper.vue'

import type { CategoryResponse, Recipe } from '../interfaces'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()

const backendUrl: string = import.meta.env.VITE_RECIPES_API_URL
const imageCropperRef = ref<InstanceType<typeof AdvancedCropper> | null>(null)
const isLoading = ref<boolean>(false)
const categories = ref<CategoryResponse[]>()
const imagePreview = ref<string>()
const imageUrl = ref<string>()
const selectedFile = ref<File>()
const recipeId = ref<string>()
const recipe = ref<Recipe>()

const myForm = reactive({
  title: '',
  description: '',
  ingredients: ref<string[]>([]),
  steps: ref<string[]>([]),
  image: '',
  category: ''
})
const formErrors = reactive({
  title: false,
  ingredients: false,
  steps: false,
  category: false
})

onMounted(async () => {
  recipeId.value = route.fullPath.split('/').slice(-1)[0] ?? ''
  if (recipeId.value.includes('?')) {
    recipeId.value = recipeId.value.split('?')[0]
  }

  recipe.value = await getRecipe()

  if (!recipe.value) return

  myForm.title = recipe.value.title
  myForm.description = recipe.value.description
  myForm.ingredients = recipe.value.ingredients.map((ingredient) => ingredient)
  myForm.steps = recipe.value.steps.map((step) => step)
  myForm.image = recipe.value.image
  myForm.category = recipe.value.Category.id
  imageUrl.value = recipe.value.image

  categories.value = recipeStore.categories
})

const addIngredient = () => {
  myForm.ingredients.push('')
}

const removeIngredient = (index: number) => {
  myForm.ingredients.splice(index, 1)
}

const addStep = () => {
  myForm.steps.push('')
}

const removeStep = (index: number) => {
  myForm.steps.splice(index, 1)
}

const getRecipe = async () => {
  if (!recipeId.value) return
  try {
    const resp = await recipeStore.getRecipe(recipeId.value)
    return resp
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Ocurrió un error al obtener la receta', 'error').then(() => {
      router.replace('/dashboard')
    })
  }
}

const onFileChange = (file: File) => {
  const imageBackend = `${backendUrl.replace('/api', '')}/no-recipe-image.jpg`

  if (file) {
    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        imagePreview.value = result
      } else {
        imagePreview.value = imageBackend
      }
    }
    reader.readAsDataURL(file)
  }
}

const onSubmit = async () => {
  isLoading.value = true

  if (!recipeId.value) return

  try {
    //* Validación del formulario
    if (myForm.title === '') return (formErrors.title = true)
    formErrors.title = false
    if (myForm.category === '') return (formErrors.category = true)
    formErrors.category = false
    if (myForm.ingredients.length <= 0) return (formErrors.ingredients = true)
    formErrors.ingredients = false
    if (myForm.steps.length <= 0) return (formErrors.steps = true)
    formErrors.steps = false

    //* Convertir datos a FormData
    const ingredients = myForm.ingredients
    const steps = myForm.steps

    const formData = new FormData()
    formData.append('title', myForm.title)
    formData.append('description', myForm.description ?? '')
    formData.append('categoryId', myForm.category)
    ingredients.forEach((ingredient) => {
      formData.append('ingredients[]', ingredient)
    })
    steps.forEach((step) => {
      formData.append('steps[]', step)
    })

    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }

    //* Enviar los datos al Store.
    const resp = await recipeStore.updateRecipe(recipeId.value, formData)

    Swal.fire('Receta Actualizada', 'La receta ha sido actualizada correctamente', 'success').then(
      () => {
        router.replace(`/dashboard/recipe/${recipeId.value}`)
      }
    )
  } catch (error) {
    Swal.fire('Error', error as string, 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const openFileInputInChild = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openFileDialog()
  }
}
</script>

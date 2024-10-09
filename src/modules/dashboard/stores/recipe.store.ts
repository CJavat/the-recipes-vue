import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  addFavoriteAction,
  createRecipeAction,
  deleteRecipeAction,
  getAllCategoriesAction,
  getAllRecipesAction,
  getFavoritesAction,
  getMyRecipesAction,
  getRecipesByCategoryAction,
  getRecipesByIdAction,
  getRecipesByUserAction,
  removeFavoriteAction,
  searchRecipesAction,
  updateRecipeAction
} from '../actions'

import type {
  CardRecipe,
  CategoryResponse,
  FavoriteResponse,
  Recipe,
  RecipeResponse
} from '../interfaces'

export const useRecipeStore = defineStore(
  'recipe',
  () => {
    const categories = ref<CategoryResponse[] | undefined>(undefined)
    const myFavorites = ref<CardRecipe[] | undefined>(undefined)

    //? Favorites
    const getFavorites = async (): Promise<FavoriteResponse[]> => {
      try {
        const favorites = await getFavoritesAction()

        if (favorites.length > 0) {
          myFavorites.value = favorites.map((favorite) => ({
            id: favorite.recipeId,
            image: favorite.recipe.image,
            title: favorite.recipe.title,
            User: {
              firstName: favorite.user.firstName
            },
            isFavorite: true
          }))
        } else {
          myFavorites.value = undefined
        }

        return favorites
      } catch (error) {
        myFavorites.value = undefined
        throw error
      }
    }

    const addFavorite = async (id: string): Promise<void> => {
      try {
        await addFavoriteAction(id)
        await getFavorites()
      } catch (error) {
        myFavorites.value = undefined
        throw error
      }
    }

    const removeFavorite = async (id: string): Promise<void> => {
      try {
        await removeFavoriteAction(id)
        await getFavorites()
      } catch (error) {
        myFavorites.value = undefined
        throw error
      }
    }

    //? Recipes
    const getRecipes = async (limit: number, offset: number): Promise<RecipeResponse> => {
      try {
        const recipes = await getAllRecipesAction(limit, offset)
        if (!recipes) throw ['No hay recetas']

        return recipes
      } catch (error) {
        // console.log(error);
        throw error
      }
    }

    const getRecipe = async (id: string): Promise<Recipe> => {
      try {
        const resp = await getRecipesByIdAction(id)
        if (!resp) throw ['No se encontró la receta']

        return resp
      } catch (error) {
        throw error
      }
    }

    const getRecipesByCategory = async (
      id: string,
      limit: number,
      offset: number
    ): Promise<RecipeResponse> => {
      try {
        const resp = await getRecipesByCategoryAction(id, limit, offset)

        return resp
      } catch (error) {
        throw error
      }
    }

    const getRecipesByUser = async (
      id: string,
      limit: number,
      offset: number
    ): Promise<RecipeResponse> => {
      try {
        const resp = await getRecipesByUserAction(id, limit, offset)

        return resp
      } catch (error) {
        throw error
      }
    }

    const getMyRecipes = async (limit: number, offset: number): Promise<RecipeResponse> => {
      try {
        const resp = await getMyRecipesAction(limit, offset)

        return resp
      } catch (error) {
        throw error
      }
    }

    const searchRecipes = async (title: string) => {
      try {
        const resp = await searchRecipesAction(title)

        return resp
      } catch (error) {
        throw error
      }
    }

    const createRecipe = async (formData: FormData): Promise<Recipe> => {
      try {
        const resp = await createRecipeAction(formData)

        return resp
      } catch (error) {
        throw error
      }
    }

    const updateRecipe = async (recipeId: string, formData: FormData): Promise<Recipe> => {
      try {
        const resp = await updateRecipeAction(recipeId, formData)

        return resp
      } catch (error) {
        throw error
      }
    }

    const deleteRecipe = async (recipeId: string): Promise<{ message: string }> => {
      try {
        const resp = await deleteRecipeAction(recipeId)
        return resp
      } catch (error) {
        throw error
      }
    }

    //? Categories
    const getCategories = async (): Promise<CategoryResponse[]> => {
      try {
        const resp = await getAllCategoriesAction()
        if (!resp) throw ['No hay categorias por mostrar']

        categories.value = resp

        return resp
      } catch (error) {
        throw error
      }
    }

    return {
      categories,
      myFavorites,

      //* Getters

      //* Actions
      getFavorites,
      addFavorite,
      removeFavorite,
      getRecipes,
      getRecipe,
      getRecipesByCategory,
      getRecipesByUser,
      getMyRecipes,
      searchRecipes,
      createRecipe,
      updateRecipe,
      deleteRecipe,
      getCategories
    }
  },
  {
    persist: {
      key: 'recipeStore',
      storage: window.localStorage
    }
  }
)

import { recipesApi } from '@/api/recipesApi'
import type {
  CategoryResponse,
  CreateDeleteFavoriteResponse,
  FavoriteResponse,
  Recipe,
  RecipeResponse
} from '../../interfaces'

//? Favorites
export const getFavoritesAction = async (): Promise<FavoriteResponse[]> => {
  try {
    const { data } = await recipesApi.get<FavoriteResponse[]>('/favorites')

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addFavoriteAction = async (recipeId: string): Promise<void> => {
  try {
    await recipesApi.get<CreateDeleteFavoriteResponse>(`/favorites/${recipeId}`)
  } catch (error) {
    throw error
  }
}

export const removeFavoriteAction = async (recipeId: string): Promise<void> => {
  try {
    await recipesApi.delete<CreateDeleteFavoriteResponse>(`/favorites/${recipeId}`)
  } catch (error) {
    throw error
  }
}

//? Recipes
export const getAllRecipesAction = async (
  limit: number,
  offset: number | undefined
): Promise<RecipeResponse> => {
  try {
    const params: Record<string, any> = { limit }
    if (offset ?? 0 <= 0) params.offset = offset

    const { data } = await recipesApi.get('/recipes', { params })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getRecipesByIdAction = async (recipeId: string): Promise<Recipe> => {
  try {
    const { data } = await recipesApi.get<Recipe>(`/recipes/${recipeId}`)

    return data
  } catch (error) {
    throw error
  }
}

export const getRecipesByCategoryAction = async (
  id: string,
  limit: number,
  offset: number | null
): Promise<RecipeResponse> => {
  try {
    if (offset! <= 0) offset = null

    const { data } = await recipesApi.get<RecipeResponse>(`/recipes/by-category/${id}`, {
      params: { limit, offset }
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getRecipesByUserAction = async (
  id: string,
  limit: number,
  offset: number | null
): Promise<RecipeResponse> => {
  try {
    if (offset! <= 0) offset = null

    const { data } = await recipesApi.get<RecipeResponse>(`/recipes/by-user/${id}`, {
      params: { limit, offset }
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getMyRecipesAction = async (
  limit: number,
  offset: number | null
): Promise<RecipeResponse> => {
  try {
    if (offset! <= 0) offset = null

    const { data } = await recipesApi.get<RecipeResponse>('/recipes/own-recipes', {
      params: { limit, offset }
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const searchRecipesAction = async (title: string): Promise<Recipe[]> => {
  try {
    const { data } = await recipesApi.get<Recipe[]>('/recipes/search', {
      params: { title }
    })

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createRecipeAction = async (formData: FormData): Promise<Recipe> => {
  try {
    const { data } = await recipesApi.post<Recipe>('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: (formData) => formData //! Revisar que haga todo bien.
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateRecipeAction = async (recipeId: string, formData: FormData): Promise<Recipe> => {
  try {
    const { data } = await recipesApi.patch<Recipe>(`/recipes/${recipeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: (formData) => formData //! Revisar que haga todo bien.
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteRecipeAction = async (recipeId: string): Promise<{ message: string }> => {
  try {
    const { data } = await recipesApi.delete(`/recipes/${recipeId}`)
    return data
  } catch (error) {
    throw error
  }
}

//? Categories
export const getAllCategoriesAction = async (): Promise<CategoryResponse[]> => {
  try {
    const { data } = await recipesApi.get('/categories')

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

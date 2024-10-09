import { AxiosError } from 'axios'
import { recipesApi } from '@/api/recipesApi'

import type { FindUserResponse, UpdateUser } from '../../interfaces'
import type { User } from '@/modules/auth/interfaces'

export const getUserProfileAction = async (id: string): Promise<FindUserResponse> => {
  try {
    const { data } = await recipesApi.get<FindUserResponse>(`/users/${id}`)

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateUserProfileAction = async (id: string, body: UpdateUser): Promise<User> => {
  try {
    if (!id) throw 'ID o Token invalidos'

    const { data } = await recipesApi.patch<User>(`/users/${id}`, body)

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updatePhotoAction = async (formData: FormData): Promise<User> => {
  try {
    const { data } = await recipesApi.patch<User>('/users/change-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: (formData) => formData //! Revisar que haga todo bien.
    })

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(JSON.stringify(error, null, 3))
    }
    console.log(error)
    throw error
  }
}

export const cancelAccountAction = async () => {
  try {
    const { data } = await recipesApi.delete<User>('/users/cancel-account')

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteAccountAction = async (): Promise<string> => {
  try {
    const { data } = await recipesApi.delete<string>('/users/permanently-delete')

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

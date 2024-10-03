import { AxiosError, isAxiosError } from 'axios'
import { recipesApi } from '@/api/recipesApi'

import type { ErrorResponse } from '@/modules/auth/interfaces'

interface ActionsResponse {
  ok: boolean
  message: string | string[]
}

export const reactivateUser = async (email: string): Promise<ActionsResponse> => {
  email = email.toLowerCase().trim()

  try {
    const { data } = await recipesApi.post('/users/reactivate-account', { email })

    return {
      ok: true,
      message: data.message
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
      const axiosError = error as AxiosError
      const loginError = axiosError.response?.data as ErrorResponse

      return {
        ok: false,
        message: loginError?.message ?? ['Ocurrió un error desconocido']
      }
    }

    throw {
      ok: false,
      message: 'Ocurrió un error desconocido'
    }
  }
}

import { isAxiosError, AxiosError } from 'axios'
import { recipesApi } from '@/api/recipesApi'

import type { ErrorResponse } from '@/modules/auth/interfaces'

interface ActionsResponse {
  ok: boolean
  message: string | string[]
}

export const updateForgotPassword = async (
  token: string,
  password: string
): Promise<ActionsResponse> => {
  try {
    const { data } = await recipesApi.post(`/auth/forgot-password/${token}`, { password })

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

    return {
      ok: false,
      message: 'Ocurrió un error desconocido'
    }
  }
}

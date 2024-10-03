import { AxiosError, isAxiosError } from 'axios'
import { recipesApi } from '@/api/recipesApi'

import type { ErrorResponse, LoginResponse } from '@/modules/auth/interfaces'

interface ActionsResponse {
  ok: boolean
  data: LoginResponse | null
  message: string | string[]
}

export const checkStatus = async (): Promise<ActionsResponse> => {
  try {
    const { data } = await recipesApi.get<LoginResponse>('/auth/check-token')

    return {
      ok: true,
      data,
      message: 'Token generado correctamente'
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error)
      const axiosError = error as AxiosError
      const loginError = axiosError.response?.data as ErrorResponse

      return {
        ok: false,
        data: null,
        message: loginError?.message ?? ['Ocurrió un error desconocido']
      }
    }

    return {
      ok: false,
      data: null,
      message: 'Ocurrió un error desconocido'
    }
  }
}

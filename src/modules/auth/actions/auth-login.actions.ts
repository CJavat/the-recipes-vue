import { AxiosError, isAxiosError } from 'axios'
import { recipesApi } from '@/api/recipesApi'

import type { ErrorResponse, LoginResponse } from '@/modules/auth/interfaces'

interface ActionsResponse {
  ok: boolean
  data: LoginResponse | null
  message: string | string[]
}

export const authLogin = async (email: string, password: string): Promise<ActionsResponse> => {
  email = email.toLowerCase().trim()

  try {
    const { data } = await recipesApi.post<LoginResponse>('/auth/login', { email, password })

    return { ok: true, data, message: 'Inicio de sesión satisfactoriamente' }
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

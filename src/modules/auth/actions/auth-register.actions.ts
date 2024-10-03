import { AxiosError, isAxiosError } from 'axios'
import { recipesApi } from '@/api/recipesApi'

import type { ErrorResponse, RegisterResponse, RegisterUser } from '@/modules/auth/interfaces'

interface ActionsResponse {
  ok: boolean
  data: RegisterResponse | null
  message: string | string[]
}

export const authRegister = async (registerUser: RegisterUser): Promise<ActionsResponse> => {
  const formatRegister: RegisterUser = {
    firstName: registerUser.firstName.toLowerCase().trim(),
    lastName: registerUser.lastName.toLowerCase().trim(),
    email: registerUser.email.toLowerCase().trim(),
    password: registerUser.password.trim()
  }

  try {
    const { data } = await recipesApi.post<RegisterResponse>('/auth/register', formatRegister)

    return {
      ok: true,
      data,
      message: 'Usuario registrado exitosamenete'
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

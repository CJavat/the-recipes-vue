import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import {
  authForgotPassword,
  authLogin,
  authRegister,
  checkStatus,
  reactivateUser,
  updateForgotPassword
} from '../actions'

import { AuthStatus, type RegisterUser, type User } from '@/modules/auth/interfaces'

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking)
  const user = ref<User | undefined>(undefined)
  const token = ref(useLocalStorage('token', ''))

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authLogin(email, password)
      if (!response.ok || response.data === null) {
        logout()
        throw Array.isArray(response.message) ? response.message[0] : response.message
      }

      localStorage.setItem('token', response.data.token)

      authStatus.value = AuthStatus.Authenticated
      user.value = response.data
      token.value = response.data.token

      return response.ok
    } catch (error) {
      console.log(error)
      logout()
      throw error as string
    }
  }

  const register = async (registerUser: RegisterUser): Promise<string> => {
    try {
      const response = await authRegister(registerUser)
      if (!response.ok) {
        logout()
        throw Array.isArray(response.message) ? response.message[0] : response.message
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw error as string
    }
  }

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      const response = await authForgotPassword(email)
      if (!response.ok) {
        logout()
        throw Array.isArray(response.message) ? response.message[0] : response.message
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw error as string
    }
  }

  const updatePassword = async (token: string, password: string) => {
    try {
      const response = await updateForgotPassword(token, password)
      if (!response.ok) {
        logout()
        throw Array.isArray(response.message) ? response.message[0] : response.message
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw error as string
    }
  }

  const reactivateAccount = async (email: string): Promise<string> => {
    try {
      const response = await reactivateUser(email)
      if (!response.ok) {
        logout()
        throw Array.isArray(response.message) ? response.message[0] : response.message
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw error as string
    }
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const response = await checkStatus()

      if (!response.ok || response.data === null) {
        logout()
        return false
      }

      localStorage.setItem('token', response.data.token)

      authStatus.value = AuthStatus.Authenticated
      user.value = response.data
      token.value = response.data.token

      return true
    } catch (error) {
      console.log(error)
      logout()
      return false
    }
  }

  const updateUser = (data: User): void => {
    //! Podría no necesitarse.
    user.value = data
  }

  const logout = () => {
    localStorage.removeItem('token')

    authStatus.value = AuthStatus.Unauthenticated
    user.value = undefined
    token.value = ''
  }

  return {
    authStatus,
    user,
    token,

    //* Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //* Actions
    login,
    register,
    forgotPassword,
    updatePassword,
    reactivateAccount,
    checkAuthStatus,
    updateUser,
    logout
  }
})

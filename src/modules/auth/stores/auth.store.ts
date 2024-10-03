import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import {
  authForgotPassword,
  authLogin,
  authRegister,
  checkStatus,
  reactivateUser
} from '../actions'

import { AuthStatus, type RegisterUser, type User } from '@/modules/interfaces'

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking)
  const user = ref<User | undefined>(undefined)
  const token = ref(useLocalStorage('token', ''))

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authLogin(email, password)
      if (!response.ok || response.data === null) {
        logout()
        throw new Error(Array.isArray(response.message) ? response.message[0] : response.message)
      }

      localStorage.setItem('token', response.data.token)

      authStatus.value = AuthStatus.Authenticated
      user.value = response.data
      token.value = response.data.token

      return response.ok
    } catch (error) {
      console.log(error)
      logout()
      throw new Error(error as string)
    }
  }

  const register = async (registerUser: RegisterUser): Promise<string> => {
    try {
      const response = await authRegister(registerUser)
      if (!response.ok) {
        logout()
        throw new Error(Array.isArray(response.message) ? response.message[0] : response.message)
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw new Error(error as string)
    }
  }

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      const response = await authForgotPassword(email)
      if (!response.ok) {
        logout()
        throw new Error(Array.isArray(response.message) ? response.message[0] : response.message)
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw new Error(error as string)
    }
  }

  const reactivateAccount = async (email: string): Promise<string> => {
    try {
      const response = await reactivateUser(email)
      if (!response.ok) {
        logout()
        throw new Error(Array.isArray(response.message) ? response.message[0] : response.message)
      }

      return response.message as string
    } catch (error) {
      console.log(error)
      logout()
      throw new Error(error as string)
    }
  }

  const checkAuthStatus = async (): Promise<User> => {
    try {
      const response = await checkStatus()
      if (!response.ok || response.data === null) {
        logout()
        throw new Error(Array.isArray(response.message) ? response.message[0] : response.message)
      }

      localStorage.setItem('token', response.data.token)

      authStatus.value = AuthStatus.Authenticated
      user.value = response.data
      token.value = response.data.token

      return response.data
    } catch (error) {
      console.log(error)
      logout()
      throw new Error(error as string)
    }
  }

  const updateUser = (data: User): void => {
    //! Podría no necesitarse.
    user.value = data
  }

  const logout = async () => {
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

    //* Actions
    login,
    register,
    forgotPassword,
    reactivateAccount,
    checkAuthStatus,
    updateUser,
    logout
  }
})

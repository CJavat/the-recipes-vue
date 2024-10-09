import { defineStore } from 'pinia'
import type { FindUserResponse, UpdateUser } from '../interfaces'
import type { User } from '@/modules/auth/interfaces'
import {
  cancelAccountAction,
  deleteAccountAction,
  getUserProfileAction,
  updatePhotoAction,
  updateUserProfileAction
} from '../actions'

interface CancelDeleteAccount {
  ok: boolean
  message: string
}

export const useUserStore = defineStore('user', () => {
  const getUser = async (id: string): Promise<FindUserResponse> => {
    try {
      const resp = await getUserProfileAction(id)
      return resp
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (id: string, body: UpdateUser): Promise<User> => {
    try {
      const resp = await updateUserProfileAction(id, body)
      return resp
    } catch (error) {
      throw error
    }
  }

  const updatePhoto = async (formData: FormData): Promise<User> => {
    try {
      const resp = await updatePhotoAction(formData)
      return resp
    } catch (error) {
      throw error
    }
  }

  const cancelAccount = async (): Promise<CancelDeleteAccount> => {
    try {
      await cancelAccountAction()
      return { ok: true, message: 'Cuenta desactivada correctamente' }
    } catch (error) {
      return { ok: false, message: 'Tu cuenta no se pudo desactivar' }
    }
  }

  const deleteAccount = async (): Promise<CancelDeleteAccount> => {
    try {
      const resp = await deleteAccountAction()
      return { ok: true, message: 'Cuenta eliminada correctamente' }
    } catch (error) {
      return { ok: true, message: 'Tu cuenta no se pudo eliminar' }
    }
  }

  return {
    getUser,
    updateProfile,
    updatePhoto,
    cancelAccount,
    deleteAccount
  }
})

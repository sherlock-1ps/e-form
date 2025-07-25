'use server'

import Axios from '@/libs/axios/axios'
import { useAuthStore } from '@/store/useAuthStore'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'
import { removeCookie, setCookie } from '@/utils/cookieHandler'

export const signIn = async (token: any) => {
  try {
    const response = await Axios.post('/auth/verify-ext', token)

    return response.data
  } catch (error: any) {
    console.error('error auth', error)
    const status = error?.response?.status ?? 500
    const code = error?.response?.data?.code ?? 'UNKNOWN'
    const message = error?.response?.data?.message ?? 'Internal Server Error'
    localStorage.removeItem('auth-storage')
    return {
      success: false,
      status,
      code,
      message
    }
  }
}

export const signOut = async () => {
  try {
    const response = await Axios.get('/logout')
    console.log('response', response)

    removeCookie('accessToken')
    removeCookie('refreshToken')
    localStorage.removeItem('auth-storage')
  } catch (error) {
    axiosErrorHandler(error, '/login')
  }
}

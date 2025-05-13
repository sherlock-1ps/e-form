"use server"

import Axios from "@/libs/axios/axios"
import { useAuthStore } from "@/store/useAuthStore"
import { axiosErrorHandler } from "@/utils/axiosErrorHandler"
import { removeCookie, setCookie } from "@/utils/cookieHandler"


export const signIn = async (credentials: any) => {
  try {
    const response = await Axios.post('/login', {
      email: credentials.email,
      password: credentials.password,
    })

    const { token } = response.data.data
    setCookie("accessToken", token)

    return {
      success: true,
      code: response.data.code,
      data: response.data.data,
    }
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const code = error?.response?.data?.code ?? 'UNKNOWN'
    const message = error?.response?.data?.message ?? 'Internal Server Error'

    return {
      success: false,
      status,
      code,
      message,
    }
  }
}

export const signOut = async () => {
  try {
    const response = await Axios.get('/logout')
    console.log("response", response);


    removeCookie("accessToken");
    removeCookie("refreshToken");

  } catch (error) {
    axiosErrorHandler(error, '/login')
  }
}

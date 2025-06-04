"use server"

import Axios from "@/libs/axios/axios"
import { useAuthStore } from "@/store/useAuthStore"
import { axiosErrorHandler } from "@/utils/axiosErrorHandler"
import { removeCookie, setCookie } from "@/utils/cookieHandler"


export const signIn = async (token: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_END_POINT_URL}/auth/verify-ext`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify(token),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        status: response.status,
        code: errorData?.code ?? 'UNKNOWN',
        message: errorData?.message ?? 'Internal Server Error',
      }
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error('error auth', error)
    return {
      success: false,
      status: 500,
      code: 'FETCH_ERROR',
      message: 'Unexpected error occurred',
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

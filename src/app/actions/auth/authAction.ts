"use server"

import Axios from "@/libs/axios/axios"
import { useAuthStore } from "@/store/useAuthStore"
import { axiosErrorHandler } from "@/utils/axiosErrorHandler"
import { removeCookie, setCookie } from "@/utils/cookieHandler"


export const signIn = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_END_POINT_URL}/auth/verify-ext`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', // ✅ ปลอมเหมือน browser
        'Origin': 'https://e-form-iota.vercel.app',
        'Referer': 'https://e-form-iota.vercel.app',
      },
      body: JSON.stringify({ token }),
    })

    const contentType = response.headers.get('content-type')

    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json()
        return {
          success: false,
          status: response.status,
          code: errorData?.code ?? 'UNKNOWN',
          message: errorData?.message ?? 'Internal Server Error',
        }
      } else {
        const errorText = await response.text()
        return {
          success: false,
          status: response.status,
          code: 'NON_JSON_RESPONSE',
          message: 'Server responded with non-JSON: ' + errorText.slice(0, 100),
        }
      }
    }

    // ✅ ถ้า response เป็น JSON จริง
    const data = await response.json()

    // ตั้ง cookie (ฝั่ง client เท่านั้น)
    if (typeof window !== 'undefined') {
      document.cookie = `accessToken=${token}; path=/;`
    }

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

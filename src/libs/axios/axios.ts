import { useAuthStore } from '@/store/useAuthStore'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

const Axios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_END_POINT_URL,
  timeout: 15100,
})


let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}



Axios.interceptors.request.use(
  async reqConfig => {
    const config = reqConfig
    const accessToken = useAuthStore.getState().accessToken



    if (config.headers && accessToken && config.url !== '/auth/verify-ext') {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }


    return config
  },
  err => Promise.reject(err)
)

Axios.interceptors.response.use(
  res => {
    const { error } = res.data
    if (error) console.log(`AXIOS INTERCEPTOR :`, error)

    return res
  },
  async err => {

    // if (typeof window !== 'undefined') {
    //   const errorCode = err.response?.data?.code
    //   if (errorCode === 'TOKEN_IS_EXPIRED') {
    //     const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_MAIN_URL
    //     if (redirectUrl) {

    //       useAuthStore.getState().clearTokens()
    //       window.location.href = redirectUrl
    //     }


    //   }
    // }



    return Promise.reject(err)
  }
)

export default Axios





// if (error?.code === ErrorCode.UNAUTHORIZED || error?.code === ErrorCode.INVALID_AUTHORIZATION) {
//   useAuthStore.getState().clearAuth()

//   if (typeof window !== 'undefined') {
//     // For clear cookies
//     window.location.href = '/'
//   }
// }

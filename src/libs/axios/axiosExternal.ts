import { useAuthStore } from '@/store/useAuthStore'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

const AxiosExternal: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_END_POINT_URL_EXTERNAL,
  timeout: 15100,
})

AxiosExternal.interceptors.request.use(
  async reqConfig => {
    const token = process.env.NEXT_PUBLIC_TOKEN_EXTERNAL


    if (reqConfig.headers && typeof reqConfig.headers.set === 'function') {
      reqConfig.headers.set('Content-Type', 'application/json')
      reqConfig.headers.set('token', token)
    }

    return reqConfig
  },
  err => Promise.reject(err)
)

AxiosExternal.interceptors.response.use(
  res => {
    const { error } = res.data
    if (error) console.log(`AxiosExternal INTERCEPTOR:`, error)
    return res
  },
  async err => {
    if (typeof window !== 'undefined') {
      const errorCode = err.response?.data?.code
      // if (errorCode === 'TOKEN_DESTROYED') {
      //   useAuthStore.getState().clearTokens()
      //   window.location.href = '/login'
      // }
    }

    return Promise.reject(err)
  }
)

export default AxiosExternal

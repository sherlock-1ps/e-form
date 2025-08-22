/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthRedirect from '@/components/AuthRedirect'
import { useAuthStore } from '@/store/useAuthStore'
import type { Locale } from '@configs/i18n'
import type { PropsWithChildren } from 'react'
import PermissionRedirect from './PermissionRedirect'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import Axios from '@/libs/axios/axios'

interface AuthGuardProps extends PropsWithChildren {
  locale: Locale
  session: string | null
}

const incrementLocalStorage = (key: string = 'redirectCounter'): number => {
  try {
    const value = parseInt(localStorage.getItem(key) || '0', 10)
    const count = value + 1
    localStorage.setItem(key, count.toString())
    return count
  } catch (error) {
    return 0
  }
}

const removeLocalStorage = (key: string = 'redirectCounter') => {
  try {
    localStorage.removeItem(key)
  } catch (error) {}
}

const getAuthFromStorage = () => {
  const storedData = localStorage.getItem('auth-storage')
  if (!storedData) {
    return null
  }
  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.error("Error parsing 'auth-storage' from localStorage:", error)
    return null
  }
}

const redirectToEndPoint = () => {
  const redirectCounter = incrementLocalStorage()
  if (redirectCounter < 3) {
    window.location.href = `${String(process.env.NEXT_PUBLIC_DTN_BASE_URL)}/login?redirectUrl=${encodeURIComponent(window.location.href)}`
  } else {
    removeLocalStorage()
    window.location.href = `${String(process.env.NEXT_PUBLIC_DTN_BASE_URL)}`
  }
}

const AuthGuard = ({ children, locale, session }: AuthGuardProps) => {
  const { showDialog } = useDialog()
  const router = useRouter()
  const accessToken = useAuthStore(state => state.accessToken)
  const profile = useAuthStore(state => state.profile)
  const searchParams = useSearchParams()
  let token = searchParams.get('token')
  const mode = searchParams.get('mode')
  const [mounted, setMounted] = useState(false)
  const [urlRedirect, setUrlRedirect] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const init = async () => {

        if (!token) {
          const authToken = getAuthFromStorage()
          token = authToken?.state?.accessToken
        }

        if (token) {
          const url = new URL(window.location.href)
          const params = url.searchParams
          params.delete('token')
          history.replaceState({}, document.title, url)

          await handleCallCheckAuth(token)
        } else {
          redirectToEndPoint()
        }

        // console.log('accessToken', getAuthFromStorage())
        // else if (!token && !accessToken) {
        //   window.location.href = String(process.env.NEXT_PUBLIC_DTN_BASE_URL)
        // }

        setMounted(true)
      }

      init()
    }
  }, [])

  const handleCallCheckAuth = async (key: any) => {
    try {
      const response = await handleGetLogin(key)

      if (response.code == 'SUCCESS') {
        useAuthStore.getState().setTokens(key ?? '')
        useAuthStore.getState().setProfile(response?.result?.data?.userLogin)

        useAuthStore.getState().setUrlLogin(response?.result?.data?.url_login || '')
        useAuthStore.getState().setUrlBase(response?.result?.data?.url_base || '')
      } else {
        if (response?.url) {
          setUrlRedirect(response.url)
        }
      }
    } catch (error) {
      console.log('error', error)

      showDialog({
        id: 'alertErrorToken',
        component: (
          <ConfirmAlert
            id='alertErrorToken'
            title={'Invailid JWT'}
            content1={'please login again!'}
            onClick={() => {
              window.location.href = urlRedirect
            }}
          />
        ),
        size: 'sm'
      })
    }
  }

  const handleGetLogin = async (token: string) => {
    try {
      const response = await Axios.post('/auth/verify-ext', { token: token })
      return response.data
    } catch (error: any) {
      redirectToEndPoint()

      console.error('error auth', error)
      const status = error?.response?.status ?? 500
      const code = error?.response?.data?.code ?? 'UNKNOWN'
      const message = error?.response?.data?.message ?? 'Internal Server Error'
      const url = error?.response?.data?.result?.data?.url_redirect
      localStorage.removeItem('auth-storage')
      return {
        success: false,
        status,
        code,
        message,
        url
      }
    }
  }

  if (!mounted) return null

  const isLoggedIn = !!accessToken && !!profile

  return isLoggedIn ? (
    <PermissionRedirect lang={locale} permission={profile?.permission}>
      {children}
    </PermissionRedirect>
  ) : (
    <AuthRedirect url={urlRedirect} />
  )
}

export default AuthGuard

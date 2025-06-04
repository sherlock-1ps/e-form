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

const AuthGuard = ({ children, locale, session }: AuthGuardProps) => {
  const { showDialog } = useDialog()
  const router = useRouter()
  const accessToken = useAuthStore(state => state.accessToken)
  const profile = useAuthStore(state => state.profile)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const init = async () => {
        if (token) {
          await handleCallCheckAuth(token)
        }

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
              alert('fill jwt in url')
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
      console.error('error auth', error)
      const status = error?.response?.status ?? 500
      const code = error?.response?.data?.code ?? 'UNKNOWN'
      const message = error?.response?.data?.message ?? 'Internal Server Error'

      return {
        success: false,
        status,
        code,
        message
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
    <AuthRedirect />
  )
}

export default AuthGuard

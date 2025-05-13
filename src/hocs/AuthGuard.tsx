/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthRedirect from '@/components/AuthRedirect'
import { useAuthStore } from '@/store/useAuthStore'
import type { Locale } from '@configs/i18n'
import type { PropsWithChildren } from 'react'
import PermissionRedirect from './PermissionRedirect'
import { useAuthAccountQueryOption } from '@/queryOptions/auth/authQueryOptions'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'

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

  const { mutateAsync, isPending } = useAuthAccountQueryOption()

  useEffect(() => {
    console.log('check auth')

    handleCallCheckAuth(
      token ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsInJvbGUiOiJhZG1pbiJ9.l28a2rfWgMw3a_A7PmrJs5Jl7getf85KUzpy22jDSww'
    )
  }, [])

  const handleCallCheckAuth = async (key: any) => {
    try {
      const response = await mutateAsync({ token: key })
      if (response.code == 'SUCCESS') {
        useAuthStore.getState().setTokens(response?.result?.data?.accessToken)
        setMounted(true)
      }
    } catch (error) {
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

  if (!mounted) return null

  // const isLoggedIn = !!session && !!accessToken && !!profile
  const isLoggedIn = !!accessToken && !!profile

  // console.log('isLoggedIn', isLoggedIn)
  // console.log('accessToken', accessToken)
  // console.log('profile', profile)

  // return isLoggedIn ? (
  //   <PermissionRedirect lang={locale} permission={profile?.permission}>
  //     {children}
  //   </PermissionRedirect>
  // ) : (
  //   <AuthRedirect lang={locale} />
  // )

  return <>{children}</>
}

export default AuthGuard

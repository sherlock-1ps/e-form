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
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5IiwianRpIjoiY2U5ZWE2OGNhMTIzN2Y3NTJiNWY0YTNjNTA1MTM0ZGVjYmE4ODcxZDQ3ODU4NDY3NjJmYmQ1ODdkNzRhZmYwMGQzNDE5ZDE4MDM3OTRlMjgiLCJpYXQiOjE3NDgyNjY3NDEuNTUwOTA2LCJuYmYiOjE3NDgyNjY3NDEuNTUwOTA5LCJleHAiOjE3Nzk4MDI3NDEuNTIwNDM5LCJzdWIiOiI1MTUyMiIsInNjb3BlcyI6W119.A8ognYNKf8dGtolbQhR2LWrPP46BynUhofK-7vG0Xr523YHqNN7K0xgo9EJnp8-aEKyxh731FDINQ2kSBItUrPPJDPaFJ-v61kDpJBCo_Srdv2SZlytqEGjEsEfn2TpDrwhjpx36245B3Dhii7glNV0ZavTdj2IEChRWwt7xUqQFsZq9MPol0u0Sw6KKtSnDiyMxLUvdBM8f0cfKfevJkLGSrhyZLru4ECsn59U42OL5IBvKHolw3TDJDjgWnquEPUIq7Rf8JkjrnLM-598JGGNOmZBO5Yw7u8itgjCLZTnIojXz4lt4RJ0m8PuTEEJ6IVfJOPqV4raiNoY6kPsMtiLrZ-8Wzl1wKUvwmkO1lAxwGuuCh-WpmmmPkc2sJBAwcG1j2rwJ1XmlIxig-fA8vHk9q2uF-iFwjaS3NzC1zUiBx46sWkjsn6rmBeu0wOqbrn0Xwz4aqe0fhDOwFRYhoCEKb2a-pDqD9YIvPoNXy6GQ6XwyKohIb4_7YtfuRq4yVIPjLm_bGFracRPyQy7RF2lVHDDuc-RMrsK3aZPa30iIaRhm3-oB2nULFnWw3ALBXNMmox0JaV1N9ota6WcCLEE9oS_x-4ohpqPjD0tIcMs73cZg4_gQVGmqm50jaNdPGsJBgVr1r687t_ozKY0_-3Xqqjd5mGrEixSL33IW-oc'
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

/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import type { Locale } from '@configs/i18n'
import { extractViewRoutesFromPermissions, viewPermissionToRouteMap } from '@/utils/viewPermissionRoutes'

interface PermissionRedirectProps extends PropsWithChildren {
  lang: Locale
  permission: string[]
}

const PermissionRedirect = ({ children, lang, permission }: PermissionRedirectProps) => {
  const pathname = usePathname()
  const router = useRouter()
  // const [hasChecked, setHasChecked] = useState(false)

  // const availableRoutes = extractViewRoutesFromPermissions(permission)

  // useEffect(() => {
  //   if (!pathname || !permission?.length) return

  //   const matchedProtectedRoute = Object.values(viewPermissionToRouteMap).find(route => pathname.includes(`/${route}`))

  //   if (!matchedProtectedRoute) {
  //     setHasChecked(true)

  //     return
  //   }

  //   const isAllowed = availableRoutes.includes(matchedProtectedRoute)

  //   if (!isAllowed) {
  //     router.replace(`/${lang}/404`)
  //   } else {
  //     setHasChecked(true)
  //   }
  // }, [pathname])

  // if (!hasChecked) return null

  return <>{children}</>
}

export default PermissionRedirect

/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useDialog } from '@/hooks/useDialog'
import { useEffect } from 'react'
import ConfirmAlert from './dialogs/alerts/ConfirmAlert'

const AuthRedirect = ({ url }: any) => {
  const { showDialog } = useDialog()

  useEffect(() => {
    const redirectUrl = url
    if (redirectUrl) {
      showDialog({
        id: 'alertErrorToken',
        component: (
          <ConfirmAlert
            id='alertErrorToken'
            title={'Invailid JWT'}
            content1={'please login again!'}
            onClick={() => {
              window.location.href = redirectUrl
            }}
          />
        ),
        size: 'sm'
      })
    } else {
      console.error('❌ NEXT_PUBLIC_REDIRECT_MAIN_URL is not defined')
    }
  }, [])

  return null
}

export default AuthRedirect

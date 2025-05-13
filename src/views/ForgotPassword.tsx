'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useForm } from 'react-hook-form'
import { useSendResetPasswordMutationOption } from '@/queryOptions/login/loginQueryOptions'
import { toast } from 'react-toastify'
import { useState } from 'react'

// Styled Custom Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type FormValues = {
  email: string
}

const ForgotPassword = ({ mode }: { mode: SystemMode }) => {
  const { dictionary } = useDictionary()
  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/login/resetImg.png'
  const lightIllustration = '/images/login/resetImg.png'

  // Hooks
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)
  const { mutateAsync, isPending, isSuccess } = useSendResetPasswordMutationOption()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormValues>()
  const onSubmit = (data: FormValues) => {
    handleSendLink(data.email)
  }

  const handleSendLink = async (email: string) => {
    try {
      const response = await mutateAsync({
        email
      })
      if (response?.code == 'SUCCESS') {
        toast.success('Send success!', { autoClose: 3000 })
      }
    } catch (error: any) {
      if (error?.code === 'USER_NOT_FOUND') {
        toast.error(dictionary?.userNotFound, { autoClose: 3000 })
        setError('email', {
          type: 'manual',
          message: dictionary?.userNotFound || 'User not found'
        })
      } else if (error?.code == 'TOO_MANY_REQUEST') {
        toast.error('Too many Request', { autoClose: 3000 })
      } else {
        toast.error('send link failed', { autoClose: 3000 })
      }
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/login', locale as Locale)}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{dictionary['login']?.forgotPassword}</Typography>
            <Typography>{dictionary['login']?.resetDetail}</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label={dictionary?.email}
              placeholder={dictionary?.enterEmail}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address'
                }
              })}
            />

            <Button fullWidth variant='contained' type='submit' disabled={isSuccess || isPending}>
              {isSuccess ? dictionary['login']?.sendLinkSuccess : dictionary['login']?.resetLink}
            </Button>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedUrl('/login', locale as Locale)} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>{dictionary['login']?.backToLogin}</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

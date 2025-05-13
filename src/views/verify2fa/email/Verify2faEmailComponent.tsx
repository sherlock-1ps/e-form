/* eslint-disable import/named */
'use client'

// React
import { useEffect, useState } from 'react'

// Next
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'

// RHF + Zod
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Toast
import { toast } from 'react-toastify'

// Internal
import CustomTextField from '@core/components/mui/TextField'
import { useSettings } from '@core/hooks/useSettings'
import { useImageVariant } from '@core/hooks/useImageVariant'
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import { getLocalizedUrl } from '@/utils/i18n'
import { useAuthStore } from '@/store/useAuthStore'
import { useVerifyEmailMutationOption } from '@/queryOptions/login/loginQueryOptions'
import CodeInput from '@/components/CodeInput'
import { extractViewRoutesFromPermissions } from '@/utils/viewPermissionRoutes'
import type { Locale } from '@/configs/i18n'
import { useReSendEmailMutationOption } from '@/queryOptions/profile/profileQueryOptions'
import { fetchProfile } from '@/app/sevices/profile/profileServices'
import { useDictionary } from '@/contexts/DictionaryContext'

// Styles
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: { maxBlockSize: 550 },
  [theme.breakpoints.down('lg')]: { maxBlockSize: 450 }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 330,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Schema
const schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type FormData = z.infer<typeof schema>

// Component
const Verify2faEmailComponent = ({ mode = 'light' }: { mode: 'light' | 'dark' }) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const { lang: locale } = useParams()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const expired = searchParams.get('expired')
  const { settings } = useSettings()
  const { mutate, isPending } = useVerifyEmailMutationOption()
  const { mutate: resend2fa, isPending: isResending } = useReSendEmailMutationOption()
  const [pincode, setPincode] = useState('')
  const [isCanResend, setIsCanResend] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/login/verify2fa.png'
  const lightIllustration = '/images/login/verify2fa.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  const onSubmit: SubmitHandler<FormData> = async () => {
    if (pincode.length < 6) {
      toast.error('Please enter your 6-digit PIN')

      return
    }
  }

  const handleResend = () => {
    if (!email) return

    resend2fa(
      { email },
      {
        onSuccess: data => {
          toast.success(dictionary['login']?.resendSuccess, { autoClose: 3000 })

          const newExpireTime = data?.data
          const nowInSeconds = Math.floor(Date.now() / 1000)

          if (newExpireTime > nowInSeconds) {
            const newCountdown = newExpireTime - nowInSeconds
            setCountdown(newCountdown)
            setIsCanResend(false)

            const timer = setInterval(() => {
              const remaining = newExpireTime - Math.floor(Date.now() / 1000)
              setCountdown(remaining)

              if (remaining <= 0) {
                clearInterval(timer)
                setIsCanResend(true)
              }
            }, 1000)

            return () => clearInterval(timer)
          } else {
            setIsCanResend(true)
          }
        },
        onError: () => {
          toast.error('Failed to resend verification code', { autoClose: 3000 })
        }
      }
    )
  }

  const handleVerifyCode = (code: string) => {
    if (!email) return
    setPincode(code)

    mutate(
      { email, pincode: code },
      {
        onSuccess: async data => {
          if (data?.code == 'SUCCESS') {
            useAuthStore.getState().setTokens(data?.data?.token)
            await handleGetProfile()
          }
        },
        onError: () => {
          toast.error('Verification failed. Please check your PIN.', { autoClose: 3000 })
        }
      }
    )
  }

  const handleGetProfile = async () => {
    try {
      const resultProfile = await fetchProfile()
      if (resultProfile?.code == 'SUCCESS') {
        useAuthStore.getState().setProfile(resultProfile.data)

        const availableRoutes = extractViewRoutesFromPermissions(resultProfile?.data?.permission)

        const redirectURL = `${availableRoutes[0]}`

        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      }
    } catch (error) {
      toast.error('some thing went wrong getProfile!', { autoClose: 3000 })
      console.log('error', error)
    }
  }

  useEffect(() => {
    const nowInSeconds = Math.floor(Date.now() / 1000)
    const expireTime = Number(expired) || 0

    if (expireTime > nowInSeconds) {
      const initialCountdown = expireTime - nowInSeconds
      setCountdown(initialCountdown)
      setIsCanResend(false)

      const timer = setInterval(() => {
        const newCountdown = expireTime - Math.floor(Date.now() / 1000)
        setCountdown(newCountdown)

        if (newCountdown <= 0) {
          clearInterval(timer)
          setIsCanResend(true)
        }
      }, 1000)

      return () => clearInterval(timer)
    } else {
      setIsCanResend(true)
    }
  }, [expired])

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={`flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden ${
          settings.skin === 'bordered' ? 'border-ie' : ''
        }`}
      >
        <ResetPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg alt='mask' src={authBackground} className={theme.direction === 'rtl' ? 'scale-x-[-1]' : ''} />
        )}
      </div>

      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/', locale as string)}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Two-Factor Authentication</Typography>
            <Typography>{dictionary['login']?.emailVerify}</Typography>
          </div>

          <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Typography className='text-center'>
              {dictionary['login']?.verifyCodeEmail} {email}
            </Typography>
            <CodeInput onComplete={handleVerifyCode} />

            {isCanResend ? (
              <Typography className='text-center'>
                {dictionary['login']?.notGetCode}{' '}
                <Button type='button' onClick={handleResend} disabled={isResending} className='text-primary'>
                  {isResending ? `${dictionary['login']?.send}...` : dictionary['login']?.resendEmail}
                </Button>
              </Typography>
            ) : (
              <Typography className='text-center'>
                {dictionary['login']?.canSendIn?.replace('{{key}}', countdown.toString())}
              </Typography>
            )}

            <Button fullWidth variant='contained' type='submit' disabled={isPending || pincode.length < 6}>
              {isPending ? dictionary?.loading : dictionary?.verify}
            </Button>

            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedUrl('/login', locale as string)} className='flex items-center gap-1.5'>
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

export default Verify2faEmailComponent

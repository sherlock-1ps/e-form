/* eslint-disable import/named */
'use client'

// React
import { useState } from 'react'

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
import {
  useSetPasswordMutationOption,
  useSetPasswordWithKeyMutationOption
} from '@/queryOptions/login/loginQueryOptions'
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
const SetNewPasswordComponent = ({ mode = 'light' }: { mode: 'light' | 'dark' }) => {
  const { dictionary } = useDictionary()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const router = useRouter()
  const { lang: locale } = useParams()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { settings } = useSettings()
  const { mutate, isPending } = useSetPasswordMutationOption()

  const { mutateAsync, isPending: pendingResetWithKey } = useSetPasswordWithKeyMutationOption()

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
  const darkIllustration = '/images/login/setPassImage.png'
  const lightIllustration = '/images/login/setPassImage.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  const handleClickShowPassword = () => setIsPasswordShown(prev => !prev)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(prev => !prev)

  const onSubmit: SubmitHandler<FormData> = async data => {
    if (key) {
      handleResetWithKey(data)
    } else {
      mutate(
        { password: data?.password },
        {
          onSuccess: () => {
            useAuthStore.getState().clearTokens()
            toast.success(dictionary['login']?.updatePass, { autoClose: 3000 })
            router.push(getLocalizedUrl('/login', locale as string))
          },
          onError: () => {
            toast.error('Failed to update password', { autoClose: 3000 })
          }
        }
      )
    }
  }

  const handleResetWithKey = async (data: FormData) => {
    try {
      const response = await mutateAsync({ key: key ?? '', password: data?.password })
      if (response.code == 'SUCCESS') {
        toast.success(dictionary['login']?.updatePass, { autoClose: 3000 })
        router.push(getLocalizedUrl('/login', locale as string))
      }
    } catch (error: any) {
      toast.error('Failed to set password or expired key', { autoClose: 3000 })
    }
  }

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
            <Typography variant='h4'>{dictionary['login']?.setNewPass}</Typography>
            <Typography>{dictionary['login']?.setNewPassDetail}</Typography>
          </div>

          <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={dictionary?.newPassword}
                  placeholder='············'
                  type={isPasswordShown ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={dictionary?.confirmPassword}
                  placeholder='············'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Button fullWidth variant='contained' type='submit' disabled={isPending || pendingResetWithKey}>
              {isPending ? `${dictionary?.loading}...` : dictionary['login']?.saveLogin}
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

export default SetNewPasswordComponent

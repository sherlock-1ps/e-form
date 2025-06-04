'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import Axios from '@/libs/axios/axios'
import { signIn } from '@/app/actions/auth/authAction'
import { useAuthStore } from '@/store/useAuthStore'
import { useDictionary } from '@/contexts/DictionaryContext'
import { toast } from 'react-toastify'
import { fetchProfile } from '@/app/sevices/profile/profileServices'
import { extractViewRoutesFromPermissions } from '@/utils/viewPermissionRoutes'
import LanguageDropdown from '@/components/layout/shared/LanguageDropdown'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  borderRadius: 12,
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

// const imageArray = ['/images/login/loginImage.png', '/images/login/login2Image.png', '/images/login/login3Image.png']
const imageArray = ['/images/login/loginImage.png']

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), nonEmpty('This field is required')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { dictionary } = useDictionary()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageArray.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: 'sherlock.h@onecent.co',
      password: '123456'
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    // setIsLoading(true)
    // const res = await signIn(data)
    // if (res?.code == 'SUCCESS' && res?.data?.two_fa_type) {
    //   if (res?.data?.two_fa_type == 'google') {
    //     router.push(`/${locale}/verify2faGoogle/?email=${data?.email}`)
    //   } else if (res?.data?.two_fa_type == 'email') {
    //     router.push(`/${locale}/verify2faEmail/?email=${data?.email}&expired=${res?.data?.expired}`)
    //   }
    // } else if (res?.code == 'SUCCESS') {
    //   useAuthStore.getState().setTokens(res.data.token)
    //   const resultProfile = await fetchProfile()
    //   if (resultProfile?.data?.is_first_login) {
    //     router.push(`/${locale}/setnewpassword`)
    //   } else {
    //     useAuthStore.getState().setProfile(resultProfile.data)
    //     const availableRoutes = extractViewRoutesFromPermissions(resultProfile?.data?.permission)
    //     const redirectURL = searchParams.get('redirectTo') ?? `${availableRoutes[0]}`
    //     router.replace(getLocalizedUrl(redirectURL, locale as Locale))
    //   }
    // } else if (res?.code == 'PINCODE_NOT_EXPIRED') {
    //   toast.error('Pincode not expired', { autoClose: 3000 })
    // } else {
    //   if (res?.code == 'INVALID_PASSWORD') {
    //     toast.error('Invalid password!', { autoClose: 3000 })
    //     setErrorState({ message: ['Invalid password'] })
    //   } else if (res?.code == 'UNKNOWN') {
    //     toast.error('Internal Server Error!', { autoClose: 3000 })
    //     setErrorState({ message: ['Internal Server Error, please try again!'] })
    //   } else if (res?.code == 'USER_NOT_FOUND') {
    //     toast.error('User not found!', { autoClose: 3000 })
    //     setErrorState({ message: ['User not found!'] })
    //   }
    // }
    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 1300)
  }

  // const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
  //   const res = await signIn(data)

  //   console.log('eee', res)

  //   if (res.code == 'SUCCESS') {
  //     useAuthStore.getState().setTokens(res.data.token)
  //     // Vars

  //     const redirectURL = searchParams.get('redirectTo') ?? '/'
  //     router.replace(getLocalizedUrl(redirectURL, locale as Locale))
  //   } else {
  //     if (res?.code == 'INVALID_PASSWORD') {
  //       toast.error('Invalid password!', { autoClose: 3000 })
  //       setErrorState({ message: ['Invalid password'] })
  //     } else if (res?.code == 'UNKNOWN') {
  //       toast.error('Internal Server Error!', { autoClose: 3000 })
  //       setErrorState({ message: ['Internal Server Error, please try again!'] })
  //     } else if (res?.code == 'USER_NOT_FOUND') {
  //       toast.error('User not found!', { autoClose: 3000 })
  //       setErrorState({ message: ['User not found!'] })
  //     }
  //   }
  // }

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
        <LoginIllustration src={imageArray[currentImageIndex]} alt='character-illustration' />

        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>

      <div className='flex flex-1 bg-backgroundPaper items-center justify-center relative'>
        <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
          <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
            <Logo />
          </div>
          <div className='absolute block-start-4 sm:block-start-7 sm:block-end-[33px] inline-end-2 sm:inline-end-[25px]'>
            <LanguageDropdown />
          </div>
          <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
            <div className='flex flex-col gap-1'>
              <Typography variant='h4'>
                {dictionary['welcomeTo']}
                {` ${themeConfig.templateName}! 👋🏻`}
              </Typography>
              <Typography>{dictionary['login']?.pleaseLogin}</Typography>
            </div>
            <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
              <Typography variant='body2' color='primary'>
                Username: <span className='font-medium'>sherlock.h@onecent.co</span> / Pass:{' '}
                <span className='font-medium'>123456</span>
              </Typography>
            </Alert>
            <form
              noValidate
              autoComplete='off'
              action={() => {}}
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-6'
            >
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type='email'
                    label={dictionary['login']?.username}
                    placeholder={dictionary['login']?.enterYourUsername}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.email || errorState !== null) && {
                      error: true,
                      helperText: errors?.email?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={dictionary['login']?.password}
                    placeholder='············'
                    id='login-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...(errors.password && { error: true, helperText: errors.password.message })}
                  />
                )}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox defaultChecked />} label={dictionary['login']?.rememberMe} />
                <Typography
                  className='text-end'
                  color='primary'
                  component={Link}
                  href={getLocalizedUrl('/forgot-password', locale as Locale)}
                >
                  {dictionary['login']?.forgotPassword}?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
                {isLoading ? (dictionary?.loading ?? 'Loading') : (dictionary['login']?.login ?? 'Login')}
              </Button>
              {/* <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary'>
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2'>or</Divider>
            <Button
              color='secondary'
              className='self-center text-textPrimary'
              startIcon={<img src='/images/logos/google.png' alt='Google' width={22} />}
              sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}
              onClick={() => signIn('google')}
            >
              Sign in with Google
            </Button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// MUI Imports
import CustomTextField from '@/@core/components/mui/TextField'
import {
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Grid,
  Typography
} from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useCreateAccountQueryOption, useFetchRoleQueryOption } from '@/queryOptions/account/accountQueryOptions'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

const CreateAccountComponent = () => {
  const router = useRouter()
  const { dictionary } = useDictionary()
  const { lang: locale } = useParams()

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const { data: roleListData, isPending: pendingRole } = useFetchRoleQueryOption()
  const { mutateAsync } = useCreateAccountQueryOption()

  const accountSchema = z
    .object({
      email: z.string().email({ message: dictionary['account']?.invalidEmail }),
      role: z.string().min(1, { message: dictionary['account']?.roleRequired }),
      password: z
        .string()
        .min(8, { message: dictionary['account']?.conditionPassword })
        .regex(/(?=.*[0-9])(?=.*[!@#$%^&*])/, {
          message: dictionary['account']?.conditionPassword
        }),
      confirmPassword: z.string().min(1, { message: dictionary['account']?.confirmRequired })
    })
    .refine(data => data.password === data.confirmPassword, {
      message: dictionary['account']?.passwordNotMatch,
      path: ['confirmPassword']
    })

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: '',
      role: '',
      password: '',
      confirmPassword: ''
    }
  })

  const passwordValue = watch('password', '')

  // Password Conditions
  const isMinLength = passwordValue.length >= 8
  const hasNumber = /[0-9]/.test(passwordValue)
  const hasSpecialChar = /[!@#$%^&*]/.test(passwordValue)

  const onSubmit = async (data: any) => {
    try {
      const response = await mutateAsync({ password: data.password, role_id: data.role, email: data.email })
      if (response?.code == 'SUCCESS') {
        toast.success(dictionary?.createSuccess, { autoClose: 3000 })
        router.push(`/${locale}/account`)
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const err = error as { code: string; message?: string }
        if (err.code == 'OPERATOR_EMAIL_DUPLICATED') {
          setError('email', {
            type: 'manual',
            message: dictionary['account']?.sameEmail
          })
        }

        toast.error(`${err.code}`, { autoClose: 3000 })
      } else {
        toast.error('Unexpected error occurred', { autoClose: 3000 })
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Grid container className='flex flex-col gap-6'>
          <Grid item xs={12} sm className='flex gap-2 justify-between'>
            <Typography variant='h5' className=' text-nowrap'>
              {dictionary['account']?.createAccount}
            </Typography>
          </Grid>
          <Divider />
          <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Grid container alignItems='start' className='flex gap-6'>
              <Grid item xs={12} sm>
                <CustomTextField
                  fullWidth
                  label={dictionary['email']}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm>
                <CustomTextField
                  select
                  fullWidth
                  {...register('role')}
                  defaultValue=''
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  label={dictionary['account']?.selectRole}
                  disabled={pendingRole}
                >
                  {roleListData?.code === 'SUCCESS'
                    ? roleListData.data.map((item: any) => (
                        <MenuItem value={item.role_id} key={item.role_id} className='capitalize'>
                          {item.role_name}
                        </MenuItem>
                      ))
                    : null}
                </CustomTextField>
              </Grid>
              <Grid container alignItems='start' className='flex gap-6'>
                <Grid item xs={12} sm>
                  <CustomTextField
                    fullWidth
                    label={dictionary['account']?.password}
                    type={isPasswordShown ? 'text' : 'password'}
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => setIsPasswordShown(!isPasswordShown)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm>
                  <CustomTextField
                    fullWidth
                    label={dictionary['account']?.confirmPassword}
                    type={isConfirmPasswordShown ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' className='text-warning'>
                  {dictionary['account']?.conditionPassword}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={8}>
                <div className='flex flex-col gap-2'>
                  <Typography className={isMinLength ? 'text-primary' : 'text-secondary'}>
                    {isMinLength ? '✅' : '❌'} {dictionary['account']?.condition1}
                  </Typography>
                  <Typography className={hasNumber ? 'text-primary' : 'text-secondary'}>
                    {hasNumber ? '✅' : '❌'} {dictionary['account']?.condition2}
                  </Typography>
                  <Typography className={hasSpecialChar ? 'text-primary' : 'text-secondary'}>
                    {hasSpecialChar ? '✅' : '❌'} {dictionary['account']?.condition3} (!, @, #, etc.)
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} sm>
              <div className='flex gap-4 justify-end'>
                <Button
                  variant='outlined'
                  onClick={() => {
                    router.back()
                  }}
                >
                  {dictionary['cancel']}
                </Button>
                <Button variant='contained' type='submit'>
                  {dictionary['account']?.createAccount}
                </Button>
              </div>
            </Grid>
          </form>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CreateAccountComponent

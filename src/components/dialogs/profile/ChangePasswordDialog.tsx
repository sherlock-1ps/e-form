'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// MUI
import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, Typography } from '@mui/material'

// Hooks
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'

// Mutation
import { useChangePasswordProfileMutationOption } from '@/queryOptions/profile/profileQueryOptions'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

// Types
interface ChangePassProps {
  id: string
}

const ChangePasswordDialog = ({ id }: ChangePassProps) => {
  const { dictionary } = useDictionary()
  const { closeDialog } = useDialog()
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const { mutateAsync } = useChangePasswordProfileMutationOption()

  const schema = z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/(?=.*[0-9])(?=.*[!@#$%^&*])/, {
          message: 'Must include number and special character'
        }),
      confirmPassword: z.string().min(1, 'Please confirm your new password')
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    })

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await mutateAsync({
        current_password: data.currentPassword,
        new_password: data.newPassword
      })

      if (response.code == 'SUCCESS') {
        toast.success('change password success!', { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const err = error as { code: string; message?: string }

        toast.error(`${err.code}`, { autoClose: 3000 })
      } else {
        toast.error('Unexpected error occurred', { autoClose: 3000 })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container className='flex flex-col gap-2' spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h5'>{dictionary['profile']?.changePassword}</Typography>
        </Grid>
        <Divider />

        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            label={dictionary['profile']?.currencyPassword}
            type={isCurrentPasswordShown ? 'text' : 'password'}
            {...register('currentPassword')}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={() => setIsCurrentPasswordShown(prev => !prev)}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <i className={isCurrentPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            label={dictionary?.newPassword}
            type={isPasswordShown ? 'text' : 'password'}
            {...register('newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={() => setIsPasswordShown(prev => !prev)}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            label={dictionary?.confirmPassword}
            type={isConfirmPasswordShown ? 'text' : 'password'}
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={() => setIsConfirmPasswordShown(prev => !prev)}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} className='flex justify-end gap-2'>
          <Button variant='outlined' onClick={() => closeDialog(id)} type='button'>
            {dictionary?.cancel ?? 'Cancel'}
          </Button>
          <Button variant='contained' type='submit'>
            {dictionary?.confirm ?? 'Confirm'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ChangePasswordDialog

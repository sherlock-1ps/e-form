'use client'

// MUI Imports
import { useState } from 'react'

import Typography from '@mui/material/Typography'

// Third-party Imports

// Component Imports
import { Button, Divider, Grid, IconButton, InputAdornment } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'

import { changePasswordAssistant } from '@/app/server/pages/assistant/assistantAction'

const schema = z
  .object({
    old_password: z.string().min(1, { message: 'Old password is required' }),
    new_password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirm_password: z.string().min(6, { message: 'Please confirm your password' })
  })
  .refine(data => data.new_password === data.confirm_password, {
    path: ['confirm_password'], // Error path
    message: 'Passwords must match' // Error message
  })

type FormValues = {
  old_password: string
  new_password: string
  confirm_password: string
}

const ChangePasswordAssistant = ({ id, user_id }: { id: string; user_id: any }) => {
  const { closeDialog } = useDialog()

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    }
  })

  const [isOldPasswordShown, setIsOldPasswordShown] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleCancelButton = (id: string) => {
    closeDialog(id)
  }

  const onSubmit = async (formData: FormValues) => {
    const payload = {
      ...formData,
      user_id: user_id
    }

    // await changePasswordAssistant(payload)

    reset()
    closeDialog(id)
  }

  return (
    <div className='max-w-[380px]'>
      <Typography variant='h4' className='flex flex-col items-center mb-2'>
        Change Password
      </Typography>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6} className='mt-1'>
          <Grid item xs={12}>
            <Controller
              name='old_password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Old Password'
                  placeholder='············'
                  id='old-password-assistant2'
                  error={!!errors.old_password}
                  helperText={errors.old_password?.message}
                  type={isOldPasswordShown ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => {
                            setIsOldPasswordShown(!isOldPasswordShown)
                          }}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isOldPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='new_password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='password-assistant2'
                  error={!!errors.new_password}
                  helperText={errors.new_password?.message}
                  type={isPasswordShown ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => {
                            setIsPasswordShown(!isPasswordShown)
                          }}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='confirm_password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Confirm Password'
                  placeholder='············'
                  id='confirm-password-assistant2'
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => {
                            setIsConfirmPasswordShown(!isConfirmPasswordShown)
                          }}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <div className='flex gap-2 justify-end pbs-0 mt-2'>
              <Button
                variant='tonal'
                color='secondary'
                type='reset'
                onClick={() => {
                  handleCancelButton(id)
                }}
              >
                Cancel
              </Button>
              <Button variant='contained' type='submit'>
                Change
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default ChangePasswordAssistant

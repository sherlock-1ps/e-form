'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Box, IconButton, InputAdornment } from '@mui/material'

// Component Imports
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import AssistantImage from './AssistantImage'
import CustomTextField from '@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import { createAssistantData, editAssistantData } from '@/app/server/pages/assistant/assistantAction'

const schemaCreate = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    phone_number: z.string().min(6, { message: 'Phone number must be at least 6 characters long' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirm_password: z.string().min(6, { message: 'Please confirm your password' }),
    description: z.string().optional(),
    profile_image: z
      .any()
      .optional()
      .refine(
        file => {
          // If no file is provided, skip validation
          if (!file) return true

          return file instanceof File
        },
        { message: 'File must be an instance of File' }
      )
      .refine(
        file => {
          if (!file) return true

          return file.size <= 1000000 // 1MB max size
        },
        { message: 'File size must be less than 5MB' }
      )
      .refine(
        file => {
          if (!file) return true

          return ['image/jpeg', 'image/png'].includes(file.type)
        },
        { message: 'Only JPEG and PNG files are allowed' }
      )
  })
  .refine(data => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: "Passwords don't match"
  })

const schemaEdit = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  phone_number: z.string().min(6, { message: 'Phone number must be at least 6 characters long' }),
  description: z.string().optional(),
  profile_image: z
    .any()
    .optional()
    .refine(
      file => {
        // If no file is provided, skip validation
        if (!file) return true

        return file instanceof File
      },
      { message: 'File must be an instance of File' }
    )
    .refine(
      file => {
        if (!file) return true

        return file.size <= 1000000 // 1MB max size
      },
      { message: 'File size must be less than 5MB' }
    )
    .refine(
      file => {
        if (!file) return true

        return ['image/jpeg', 'image/png'].includes(file.type)
      },
      { message: 'Only JPEG and PNG files are allowed' }
    )
})

type AssistantDialogProps = {
  data?: any
  id: string
}

type FormValues = {
  username: string
  password?: string
  confirm_password?: string
  phone_number: string
  description?: string
  profile_image?: any
  is_active?: boolean
  is_owner?: boolean
}

const AssistantDialog = ({ data, id }: AssistantDialogProps) => {
  const { closeDialog } = useDialog()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    resolver: zodResolver(data ? schemaEdit : schemaCreate),
    defaultValues: {
      username: data?.username || '',
      password: '',
      confirm_password: '',
      phone_number: data?.phone_number || '',
      description: data?.description || '',
      profile_image: data?.profile_image || '',
      is_active: true,
      is_owner: false
    }
  })

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async (formData: FormValues) => {
    if (data) {
      const payload = {
        user_id: data?.id,
        username: formData.username,
        phone_number: formData.phone_number,
        description: formData.description,
        profile_image: formData.profile_image
      }

      // await editAssistantData(payload)
    } else {
      // await createAssistantData(formData)
      reset()
    }

    closeDialog(id)
  }

  const handleCancel = () => {
    reset()
    closeDialog(id)
  }

  return (
    <Box>
      <Typography variant='h4' className='flex flex-col gap-2 text-center p-6'>
        {data ? 'Edit Assistant' : 'Create Assistant'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='overflow-visible pbs-0 sm:pli-16'>
          <AssistantImage control={control} name='profile_image' errors={errors} />
          <Grid container spacing={5} className='mt-2'>
            {/* Username */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='username'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Username'
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='phone_number'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Phone Number (optional)'
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                  />
                )}
              />
            </Grid>

            {/* Password */}
            {data ? null : (
              <>
                <Grid item xs={6}>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Password'
                        type={isPasswordShown ? 'text' : 'password'}
                        error={!!errors.password || !!errors.confirm_password}
                        helperText={errors.password?.message}
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
                      />
                    )}
                  />
                </Grid>
                {/* Confirm Password */}
                <Grid item xs={6}>
                  <Controller
                    name='confirm_password'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Confirm Password'
                        type={isConfirmPasswordShown ? 'text' : 'password'}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
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
              </>
            )}

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Description (optional)'
                    multiline
                    rows={4}
                    placeholder='Write a Comment...'
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>
        <div className='flex gap-2 justify-end pbs-0 sm:pli-16 mt-2'>
          <Button variant='tonal' color='secondary' type={data ? 'button' : 'reset'} onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='contained' type='submit' disabled={data ? !isDirty : false}>
            {data ? 'Edit' : 'Create'}
          </Button>
        </div>
      </form>
    </Box>
  )
}

export default AssistantDialog

'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

interface ConfirmProps {
  title: string
  id: string
  onClick: () => void
}

const ChangePasswordPlayerDialog = ({ id, title, onClick }: ConfirmProps) => {
  const { closeDialog } = useDialog()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    closeDialog(id)
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  return (
    <Grid container className='flex flex-col gap-4 max-w-[360px]' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
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
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              fullWidth
              label='Confirm Password'
              placeholder='············'
              type={isConfirmPasswordShown ? 'text' : 'password'}
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
          </Grid>
        </Grid>

        <Grid item xs={12} className='flex items-center justify-end gap-2 mt-4'>
          <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
            Cancel
          </Button>

          <Button type='submit' variant='contained' color={'primary'}>
            Change
          </Button>
        </Grid>
      </form>
    </Grid>
  )
}

export default ChangePasswordPlayerDialog

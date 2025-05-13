'use client'
import * as React from 'react'

import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import type { TextFieldProps } from '@mui/material/TextField'

import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import Button from '@mui/material/Button'

import Grid from '@mui/material/Grid'

import CustomTextField from '@/@core/components/mui/TextField'
import RoleDialog from '../dialogs/role'
import { useDialog } from '@/hooks/useDialog'

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  isIcon,
  ...props
}: {
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  debounce?: number
  isIcon?: boolean
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState<string | number>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fakeEvent = {
        target: { value }
      } as React.ChangeEvent<HTMLInputElement>

      onChange(fakeEvent)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      InputProps={{
        endAdornment: isIcon ? (
          <InputAdornment position='end'>
            <IconButton onClick={() => {}}>
              <i className='tabler-search' />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  )
}

export default function CardInputSearchRole({
  value,
  onChange
}: {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const { showDialog } = useDialog()

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant='h6'>Role Name</Typography>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm>
            <DebouncedInput
              value={value ?? ''}
              onChange={newValue => {
                onChange(newValue)
              }}
              placeholder='Search Roles'
              className='w-full'
              isIcon={true}
            />
          </Grid>
          <Grid item xs='auto' textAlign='right'>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
              onClick={() => {
                showDialog({
                  id: 'sampleDialog2',
                  component: <RoleDialog id={'sampleDialog2'} />,
                  size: 'sm'
                })
              }}
            >
              Create Role
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

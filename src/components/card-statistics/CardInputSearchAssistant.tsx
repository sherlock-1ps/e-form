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
import { useDialog } from '@/hooks/useDialog'
import AssistantDialog from '../dialogs/assistant'

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  isIcon,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  isIcon?: boolean
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
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

export default function CardInputSearchAssistant({ data, setAssistantData }: any) {
  const [inputSearchUsername, setInputSearchUsername] = useState('')
  const [inputSearchPhone, setInputSearchPhone] = useState('')
  const { showDialog } = useDialog()

  useEffect(() => {
    if (inputSearchUsername === '' && inputSearchPhone === '') {
      setAssistantData(data)
    } else {
      const updateData = data.filter(
        (item: any) =>
          item.username.toLowerCase().includes(inputSearchUsername.toLowerCase()) &&
          item.phone_number.includes(inputSearchPhone)
      )

      setAssistantData(updateData)
    }
  }, [inputSearchUsername, inputSearchPhone])

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm>
            <Typography variant='h6'>Username</Typography>
            <DebouncedInput
              value={inputSearchUsername ?? ''}
              onChange={value => setInputSearchUsername(String(value))}
              placeholder='Search Username'
              className='w-full'
              isIcon={true}
            />
          </Grid>
          <Grid item xs={12} sm>
            <Typography variant='h6'>Phonenumber</Typography>
            <DebouncedInput
              value={inputSearchPhone ?? ''}
              onChange={value => setInputSearchPhone(String(value))}
              placeholder='Search Phonenumber'
              className='w-full'
              isIcon={true}
            />
          </Grid>

          <Grid item xs='auto' textAlign='right' alignSelf={'end'}>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
              onClick={() => {
                showDialog({
                  id: 'assistantCreateDialog',
                  component: <AssistantDialog id='assistantCreateDialog' />
                })
              }}
            >
              Create Assistant
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

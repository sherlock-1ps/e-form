// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Checkbox, Divider, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import React, { useEffect, useState } from 'react'

interface confirmProps {
  id: string
  onClick: () => void
}

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

const GameCredentialProviderDialog = ({ id, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Select game in Provider for Credential</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12} className='flex items-end'>
        <div className='flex items-center'>
          <Checkbox defaultChecked />
          <Typography className='text-nowrap'>Select All</Typography>
        </div>
        <DebouncedInput
          value={''}
          placeholder='Search game'
          onChange={() => {}}
          className='w-full ml-4'
          isIcon={true}
          label='Game Name'
        />
      </Grid>

      <Grid container>
        <Grid item xs={12} className='flex gap-2 flex-wrap items-center justify-center'>
          <div>
            <div className='flex items-center'>
              <Checkbox defaultChecked />
              <Typography className='text-nowrap'>Treasures of Aztec</Typography>
            </div>
            <img alt='gameProvider' src='/images/game/gameImg.png' className='w-[166px] h-[240px]' />
          </div>
        </Grid>
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-4'>
        <Button
          variant='outlined'
          onClick={() => {
            closeDialog(id)
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id), onClick()
          }}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}

export default GameCredentialProviderDialog

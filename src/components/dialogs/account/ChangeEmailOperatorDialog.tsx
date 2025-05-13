'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'

interface confirmProps {
  id: string
  onClick: () => void
  data: any
}

const ChangeEmailOperatorDialog = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()

  const [inputEmail, setInputEmail] = useState('')

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Email Change for {data} Operator</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <Typography>
          Once you change the email, the user will no longer be able to log in with their old email.
        </Typography>
      </Grid>
      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField
          fullWidth
          type='text'
          label='New Email'
          placeholder=''
          value={inputEmail}
          onChange={e => {
            setInputEmail(e.target.value)
          }}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
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
          disabled={!inputEmail}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}

export default ChangeEmailOperatorDialog

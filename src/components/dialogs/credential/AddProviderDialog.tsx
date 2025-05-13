'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import { toast } from 'react-toastify'
import AddProviderTable from '@/views/credential/provider/AddProviderTable'

interface CredentialDialogProps {
  id: string
  onClick: () => void
}

const AddProviderDialog = ({ id, onClick }: CredentialDialogProps) => {
  const { closeDialog } = useDialog()

  return (
    <Grid container className='flex flex-col' spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5'>Add new provider</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} className='flex gap-2'>
        <AddProviderTable
          dataTable={[
            {
              no: 1,
              provider_name: 'Pocket Games',
              provider_image: 'https://example.com/images/pg.png',
              credential: 'PG12345',
              currency: 'THB',
              is_enable: true
            },
            {
              no: 2,
              provider_name: 'Spinix',
              provider_image: 'https://example.com/images/spinix.png',
              credential: 'SPN67890',
              currency: 'USD',
              is_enable: false
            }
          ]}
        />
      </Grid>

      <Grid item xs={12} className='flex gap-2 justify-end'>
        <Button variant='outlined' onClick={() => closeDialog(id)}>
          Cancel
        </Button>
        <Button variant='contained'>Add</Button>
      </Grid>
    </Grid>
  )
}

export default AddProviderDialog

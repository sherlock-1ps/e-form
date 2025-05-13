'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Chip, Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProvider } from '@/app/sevices/provider/provider'
import { toast } from 'react-toastify'
import UploadPaymentImage from './UploadPaymentImage'
import CustomTextField from '@/@core/components/mui/TextField'

interface confirmProps {
  id: string
  onClick: () => void
  data?: any
}

const UploadPaymentInvoiceDialog = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()
  const [fileImg, setFileImg] = useState(null)
  const [urlLink, setUrlLink] = useState('')

  const handleUpload = async () => {
    if (fileImg) {
    } else {
      toast.error('not have file')
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Upload Payment</Typography>
      </Grid>
      <Divider />
      <Grid container className='flex gap-4 py-4'>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Please upload your payment receipt or enter the URL Link payment details below.
          </Typography>
        </Grid>

        <Grid item xs={12} sm>
          <UploadPaymentImage setFileImg={setFileImg} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' className='text-center'>
            OR
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            label='URL Link'
            placeholder='ex. http://URLImage.com'
            value={urlLink}
            onChange={e => {
              setUrlLink(e.target.value)
            }}
          />
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
          disabled={!fileImg && !urlLink}
          variant='contained'
          onClick={() => {
            handleUpload()
          }}
        >
          Upload
        </Button>
      </Grid>
    </Grid>
  )
}

export default UploadPaymentInvoiceDialog

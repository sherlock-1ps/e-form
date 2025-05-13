'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Chip, Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProvider } from '@/app/sevices/provider/provider'
import { toast } from 'react-toastify'
import UploadProviderImage from './UploadProviderImage'

interface confirmProps {
  id: string
  onClick: () => void
  data?: any
}

const ChangeProviderLogoDialog = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()
  const [fileImg, setFileImg] = useState(null)
  const queryClient = useQueryClient()

  const { mutate: toggleProviderLogo, isPending: pendingLogoUpdate } = useMutation({
    mutationFn: updateProvider,
    onError: error => {
      console.error('Error updating provider logo:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
    }
  })

  const handleUpload = async () => {
    if (fileImg) {
      toggleProviderLogo({
        provider_id: data.provider_id,
        image: fileImg
      })
      closeDialog(id)
    } else {
      toast.error('not have file')
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Change provider logo</Typography>
      </Grid>
      <Divider />
      <Grid container className='flex gap-4 py-4'>
        <Grid xs={12} sm={5}>
          <div className='flex flex-col gap-2 w-full items-center justify-center'>
            <Typography>Provider Name</Typography>
            <Typography variant='h5'>Pocket Game Soft</Typography>
            <div className='flex flex-col gap-1 mt-2 items-center'>
              <Typography>Type</Typography>

              <div className='flex gap-1'>
                {data.categories.map((item: any, index: number) => {
                  return (
                    <Chip
                      key={index}
                      label={item}
                      variant='filled'
                      size='small'
                      className={`self-start rounded-sm  bg-${item} text-white capitalize`}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm>
          <UploadProviderImage setFileImg={setFileImg} />
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
          disabled={!fileImg}
          variant='contained'
          onClick={() => {
            handleUpload()
          }}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}

export default ChangeProviderLogoDialog

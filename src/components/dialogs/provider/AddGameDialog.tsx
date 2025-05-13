// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import UploadThumbnailImage from './UploadThumbnailImage'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGameProvider, updateGameProvider } from '@/app/sevices/provider/provider'
import { toast } from 'react-toastify'

interface confirmProps {
  id: string
  onClick: () => void
  data: any
  providerCode: string
}

const AddGameDialog = ({ id, onClick, data, providerCode }: confirmProps) => {
  console.log(data)

  const { closeDialog } = useDialog()
  const queryClient = useQueryClient()
  const [fileImg, setFileImg] = useState(null)
  const [inputGameName, setInputGameName] = useState('')
  const [inputGameCode, setInputGameCode] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: createGameProvider,
    onError: error => {
      console.error('Error create game provider:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gameProvider'] })
    }
  })

  const handleUpload = async () => {
    if (fileImg) {
      mutate({
        game_code: inputGameCode,
        game_name: inputGameName,
        provider_code: providerCode,
        image: fileImg,
        category: 'slot'
      })
      closeDialog(id)
    } else {
      toast.error('not have file', { autoClose: 3000 })
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Add Game</Typography>
      </Grid>
      <Divider />

      <Grid item xs={12} sm>
        <UploadThumbnailImage setFileImg={setFileImg} />
      </Grid>
      <Grid item xs={12} sm>
        <CustomTextField
          fullWidth
          label='Game Name'
          variant='outlined'
          placeholder=''
          value={inputGameName}
          onChange={e => setInputGameName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm>
        <CustomTextField
          fullWidth
          label='Game Code'
          variant='outlined'
          placeholder=''
          value={inputGameCode}
          onChange={e => setInputGameCode(e.target.value)}
        />
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
          onClick={handleUpload}
          disabled={!(fileImg && inputGameName && inputGameCode) || isPending}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddGameDialog

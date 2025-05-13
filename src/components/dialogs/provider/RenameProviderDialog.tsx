// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { updateGameProvider } from '@/app/sevices/provider/provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface confirmProps {
  id: string
  onClick: () => void
  data: any
}

const RenameProviderDialog = ({ id, onClick, data }: confirmProps) => {
  const queryClient = useQueryClient()
  const { closeDialog } = useDialog()
  const [inputGameName, setInputGameName] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: updateGameProvider,

    onError: (error, _, context) => {
      console.error('Error updating game provider:', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gameProvider'] })
    }
  })

  const handleConfirm = (name: string) => {
    mutate({
      game_id: data.game_id,
      game_name: name
    })
    closeDialog(id)
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Rename</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField
          fullWidth
          type='text'
          label='Old Game Name'
          placeholder={''}
          value={data?.game_name}
          disabled
        />
        <CustomTextField
          fullWidth
          type='text'
          label='New Game Name'
          placeholder=''
          value={inputGameName}
          onChange={e => {
            setInputGameName(e.target.value)
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
            handleConfirm(inputGameName)
          }}
          disabled={!inputGameName || isPending}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}

export default RenameProviderDialog

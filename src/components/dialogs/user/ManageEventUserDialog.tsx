'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

interface ConfirmProps {
  title: string
  mode?: string
  id: string
  onClick: () => void
}

const ManageEventUserDialog = ({ id, title, mode, onClick }: ConfirmProps) => {
  const { closeDialog } = useDialog()
  const [agentCode, setAgentCode] = useState<string>('')
  const [note, setNote] = useState<string>('')

  const handleAgentCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAgentCode(e.target.value)
  }

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    closeDialog(id)
  }

  return (
    <Grid container className='flex flex-col gap-4 max-w-[360px]' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            {mode == 'addAgent' ? (
              <CustomTextField
                fullWidth
                label={'Agent Code'}
                placeholder='Enter Code'
                value={agentCode}
                onChange={handleAgentCodeChange}
              />
            ) : (
              <CustomTextField select fullWidth defaultValue='' label='Select Promotion'>
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Promotion 1</MenuItem>
                <MenuItem value={20}>Promotion 2</MenuItem>
                <MenuItem value={30}>Promotion 3</MenuItem>
              </CustomTextField>
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField fullWidth label='Note' placeholder='Add a note' value={note} onChange={handleNoteChange} />
          </Grid>
        </Grid>

        <Grid item xs={12} className='flex items-center justify-end gap-2 mt-4'>
          <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
            Cancel
          </Button>

          <Button type='submit' variant='contained' color={'primary'}>
            {mode === 'addAgent' ? 'Add Agent' : 'Sent'}
          </Button>
        </Grid>
      </form>
    </Grid>
  )
}

export default ManageEventUserDialog

// React Imports

// MUI Imports
import type { SyntheticEvent } from 'react'
import { useState } from 'react'

import Button from '@mui/material/Button'
import { DialogTitle, Grid, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'

interface confirmProps {
  title: string
  mode?: string
  id: string
  onClick?: () => void
}

const ManageGroupDepositDialog = ({ id, title, mode, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()

  const [isMoreBank, setIsMoreBank] = useState(1)

  return (
    <div className='flex flex-col max-w-[400px]'>
      <DialogTitle className='flex flex-col gap-2 text-center '>
        <Typography variant='h5'>{title}</Typography>
      </DialogTitle>
      <form onSubmit={e => e.preventDefault()}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomTextField fullWidth autoComplete='off' label='Group name' placeholder='Group name' />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField fullWidth autoComplete='off' label='Use with (Optional)' placeholder='' />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField select fullWidth defaultValue='' label='Main bank account'>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>scb</MenuItem>
              <MenuItem value={20}>kbank</MenuItem>
              <MenuItem value={30}>bbl</MenuItem>
            </CustomTextField>
          </Grid>

          {isMoreBank == 2 && (
            <>
              <Grid item xs={12}>
                <CustomTextField select fullWidth defaultValue='' label='sup bank account'>
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>scb</MenuItem>
                  <MenuItem value={20}>kbank</MenuItem>
                  <MenuItem value={30}>bbl</MenuItem>
                </CustomTextField>
              </Grid>
            </>
          )}

          {isMoreBank == 1 ? (
            <Grid item xs={12}>
              <Button
                variant='outlined'
                color='info'
                startIcon={<i className='tabler-plus' />}
                className='max-sm:is-full'
                onClick={() => {
                  setIsMoreBank(2)
                }}
              >
                Add More sup Bank
              </Button>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Button
                variant='outlined'
                color='error'
                startIcon={<i className='tabler-plus' />}
                className='max-sm:is-full'
                onClick={() => {
                  setIsMoreBank(1)
                }}
              >
                Delete sup Bank
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Grid item xs={12} className='flex gap-2 items-center justify-end mt-4'>
        <Button
          variant='outlined'
          type='reset'
          color='primary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          Cancel
        </Button>
        <Button variant='contained' type='submit'>
          Add Group
        </Button>
      </Grid>
    </div>
  )
}

export default ManageGroupDepositDialog

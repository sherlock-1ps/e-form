'use client'
// React Imports
// MUI Imports
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import Button from '@mui/material/Button'
import { Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'
import classnames from 'classnames'

import { useDialog } from '@/hooks/useDialog'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import CustomTextField from '@/@core/components/mui/TextField'

interface confirmProps {
  title: string
  content?: string
  id: string
  onClick: () => void
}

const AddTagPlayerDialog = ({ id, title, content, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()

  return (
    <Grid container className='flex flex-col gap-4 max-w-[530px]' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>

      <form onSubmit={e => e.preventDefault()}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Tag name' placeholder='Tag name' />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Color' placeholder='Color' />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography>Choose Condition</Typography>
          </Grid>

          <Grid item xs={12} sm>
            <CustomTextField select fullWidth defaultValue='' label=''>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Slot active</MenuItem>
              <MenuItem value={20}>Casino active</MenuItem>
              <MenuItem value={30}>Sport active</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid item xs={12} sm>
            <CustomTextField select fullWidth defaultValue='' label=''>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Between</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <CustomTextField label='' placeholder='' />
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <CustomTextField label='' placeholder='' />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant='outlined'
              color='info'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
              onClick={() => {}}
            >
              Add More Condition
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
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
          Add Tag
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddTagPlayerDialog

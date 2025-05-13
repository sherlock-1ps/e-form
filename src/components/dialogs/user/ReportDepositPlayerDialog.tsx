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
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { toast } from 'react-toastify'

interface confirmProps {
  title: string
  id: string
  user?: string
  onClick: () => void
}

const ReportDepositPlayerDialog = ({ id, title, user, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()
  const [isAddBank, setIsAddBank] = useState(false)
  const [date, setDate] = useState<Date | null | undefined>(new Date())
  const [time, setTime] = useState<Date | null | undefined>(new Date())
  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        toast.success('Slip uploaded successfully!', { autoClose: 2000 })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Grid container className='flex flex-col gap-4 max-w-[430px]' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{title}</Typography>
      </Grid>

      <form onSubmit={e => e.preventDefault()}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='UserID' placeholder='UserId' value={user} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              label='Topup Amount'
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <AppReactDatepicker
              selected={date}
              onChange={(date: Date | null) => setDate(date)}
              placeholderText='Click to select a date'
              customInput={<CustomTextField label='Date' fullWidth />}
              dateFormat='dd/MM/yyyy'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <AppReactDatepicker
              showTimeSelect
              selected={time}
              timeIntervals={15}
              showTimeSelectOnly
              dateFormat='h:mm aa'
              onChange={(date: Date | null) => setTime(date)}
              customInput={<CustomTextField label='Time' fullWidth />}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField select fullWidth defaultValue='' label='Received Account'>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>121-1-12131-1 โรเบิรตตต</MenuItem>
              <MenuItem value={20}>121-1-12131-2 นายำำำ</MenuItem>
              <MenuItem value={30}>121-1-12131-3 นยรนยรนย</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6'>Upload Slip</Typography>

            <input type='file' accept='image/*' id='upload-slip' hidden onChange={handleImageUpload} />

            <label htmlFor='upload-slip'>
              <Button variant='outlined' component='span' fullWidth>
                {image ? 'Change Slip' : 'Upload Slip'}
              </Button>
            </label>

            {image && (
              <div className='mt-4 flex flex-col items-center'>
                <img src={image} alt='Slip Preview' className='w-full max-h-[200px] object-contain rounded-md' />
              </div>
            )}
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomTextField fullWidth label='Note' placeholder='Enter Note' />
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
          Notice
        </Button>
      </Grid>
    </Grid>
  )
}

export default ReportDepositPlayerDialog

'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'

interface signProps {
  id: string
  onClick: () => void
}

const CertifySignDialog = ({ id, onClick }: signProps) => {
  const { closeDialog } = useDialog()
  const [formData, setFormData] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนาม (ใบรับรองอิเล็กทรอนิกส์)
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          rows={4}
          multiline
          fullWidth
          label='ความคิดเห็น'
          placeholder='ระบุความคิดเห็น...'
          value={formData}
          onChange={e => setFormData(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>ยืนยันตัวตน</Typography>
      </Grid>
      <Grid item xs={6}>
        <CustomTextField select fullWidth defaultValue='' label='เลือกใบรับรองอิเล็กทรอนิกส์'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>978-1-4565-8759-8</MenuItem>
        </CustomTextField>
      </Grid>
      <Grid item xs={6}>
        <CustomTextField
          fullWidth
          label='รหัสผ่าน'
          type={isPasswordShown ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                  <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id), onClick()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default CertifySignDialog

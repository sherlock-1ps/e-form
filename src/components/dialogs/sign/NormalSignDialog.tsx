'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'

interface signProps {
  id: string
  onClick: () => void
}

const NormalSignDialog = ({ id, onClick }: signProps) => {
  const { closeDialog } = useDialog()
  const [formData, setFormData] = useState('')

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนาม
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          rows={5}
          multiline
          fullWidth
          label='ความคิดเห็น'
          placeholder='ระบุความคิดเห็น...'
          value={formData}
          onChange={e => setFormData(e.target.value)}
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

export default NormalSignDialog

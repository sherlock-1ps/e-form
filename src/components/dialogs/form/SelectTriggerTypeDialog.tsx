'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

interface triggerTypeProps {
  id: string
  onAdd: (type1: any, type2: any) => void
}

const typeMenu = [
  { id: 1, key: 'variable', name: 'Variable' },
  { id: 2, key: 'field', name: 'Field' },
  { id: 3, key: 'string', name: 'กำหนดเอง' }
]

const SelectTriggerTypeDialog = ({ id, onAdd }: triggerTypeProps) => {
  const { closeDialog } = useDialog()

  const [type1, setType1] = useState('')
  const [type2, setType2] = useState('')

  const handleClickConfirm = () => {
    if (!type1 || !type2) {
      toast.error('กรุณาเลือกตัวแปรให้ครบถ้วน', { autoClose: 3000 })

      return
    }
    onAdd(type1, type2)
    closeDialog(id)
  }

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>กรอกประเภทของตัวแปร 1 และ ตัวแปร 2</Typography>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          select
          fullWidth
          label='ตัวแปรที่ 1'
          value={type1}
          onChange={e => setType1(e.target.value)}
          SelectProps={{
            displayEmpty: true
          }}
        >
          <MenuItem value='' disabled>
            <em className='opacity-50'>ตัวเลือก...</em>
          </MenuItem>
          {typeMenu.map(menu => (
            <MenuItem key={menu.id} value={menu.key}>
              {menu.name}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField
          select
          fullWidth
          label='ตัวแปรที่ 2'
          value={type2}
          onChange={e => setType2(e.target.value)}
          SelectProps={{
            displayEmpty: true
          }}
        >
          <MenuItem value='' disabled>
            <em className='opacity-50'>ตัวเลือก...</em>
          </MenuItem>
          {typeMenu.map(menu => (
            <MenuItem key={menu.id} value={menu.key}>
              {menu.name}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>

      <Grid item xs={12} className='flex items-center justify-end gap-2'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
          ยกเลิก
        </Button>
        <Button variant='contained' onClick={handleClickConfirm}>
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default SelectTriggerTypeDialog

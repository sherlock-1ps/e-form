'use client'

import { useState, useEffect } from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import { Info } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'

interface AddPathFlowDialogProps {
  id: string
}

const AddPathFlowDialog = ({ id }: AddPathFlowDialogProps) => {
  const { closeDialog } = useDialog()
  const [enabled, setEnabled] = useState(false)
  const [minStep, setMinStep] = useState(1)
  const [radioValue, setRadioValue] = useState<'sign' | 'custom'>('sign')

  useEffect(() => {
    setEnabled(false)
    setMinStep(1)
  }, [radioValue])

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          เส้นทางงาน
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body2' className='text-center'>
          กำหนดเส้นทางงานและการดำเนินการให้กระบวนการนี้
        </Typography>
      </Grid>

      <Grid item xs={12} className='flex items-center justify-center'>
        <RadioGroup
          row
          value={radioValue}
          name='path-type'
          onChange={e => setRadioValue(e.target.value as 'sign' | 'custom')}
        >
          <FormControlLabel value='sign' control={<Radio />} label='ลงนาม' />
          <FormControlLabel value='custom' control={<Radio />} label='กำหนดเอง' />
        </RadioGroup>
      </Grid>

      <Grid item xs={12}>
        <CustomTextField fullWidth label='ชื่อเส้นทางงาน' placeholder='' />
      </Grid>

      {radioValue == 'sign' && (
        <Grid item xs={12}>
          <CustomTextField fullWidth label='ระบุจุดที่ลงนาม' placeholder='' />
        </Grid>
      )}

      <Grid item xs={12}>
        <div className='flex items-center gap-3'>
          <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} color='primary' />
          <Typography className={enabled ? 'text-gray-800' : 'text-gray-400'}>
            กำหนดให้มีจำนวนขั้นต่ำของการดำเนินการเพื่อทำงานต่อ
          </Typography>
          {enabled && (
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>การดำเนินการขั้นต่ำ</Typography>
              <TextField
                type='number'
                value={minStep}
                onChange={e => setMinStep(Number(e.target.value))}
                size='small'
                inputProps={{ min: 1 }}
              />
            </div>
          )}
        </div>
      </Grid>

      {radioValue == 'sign' && (
        <Grid item xs={12}>
          <Card className='bg-[#E9E5FB] rounded-xl'>
            <CardContent className='flex gap-3 p-6 items-start text-[#5B50C3]'>
              <Info className='mt-1 w-5 h-5' />
              <div className='space-y-1 text-sm leading-6 font-thin'>
                <p className='font-medium'>ลงนาม</p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>การดำเนินการลงนาม ในรูปแบบของ Electronic Sign</li>
                  <li>ใช้ได้กับ e-Form ที่มีการกำหนด E-Signature ไว้ในฟอร์มแล้วเท่านั้น</li>
                  <li>ต้องระบุ ID ของ E-Signature ที่จะลงนาม</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

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
            closeDialog(id)
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddPathFlowDialog

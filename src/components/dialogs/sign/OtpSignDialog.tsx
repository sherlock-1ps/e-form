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

const OtpSignDialog = ({ id, onClick }: signProps) => {
  const { closeDialog } = useDialog()
  const [formData, setFormData] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [isCanResend, setIsCanResend] = useState(false)
  const [countdown, setCountdown] = useState(30)

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // รับเฉพาะตัวเลข

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // focus ช่องถัดไป
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      prev?.focus()
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนามโดย OTP
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
        <Typography variant='h6'>ยืนยันตัวตนโดย OTP</Typography>
      </Grid>

      <Grid item xs={12} className='flex gap-2 justify-center'>
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={value}
            onChange={e => handleOtpChange(index, e.target.value)}
            onKeyDown={e => handleOtpKeyDown(index, e)}
            className='w-12 h-12 border text-center text-xl rounded focus:outline-primary'
          />
        ))}
      </Grid>
      <Grid item xs={12}>
        {isCanResend ? (
          <Typography className='text-center'>
            ไม่ได้รับ OTP
            <Button type='button' className='text-primary'>
              ส่งอีกครั้ง
            </Button>
          </Typography>
        ) : (
          <Typography className='text-center'>ส่งอีกครั้งใน {countdown.toString()} วินาที</Typography>
        )}
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

export default OtpSignDialog

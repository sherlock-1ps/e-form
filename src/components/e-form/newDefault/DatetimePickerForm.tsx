'use client'

import { useState, useRef, useEffect } from 'react'
import { Typography, InputAdornment, IconButton } from '@mui/material'
import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'
import { useFormStore } from '@/store/useFormStore'
import FormControl from '@mui/material/FormControl'
import ClearIcon from '@mui/icons-material/Clear' // 👈 เพิ่ม ClearIcon
const DatetimePickerForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const valueFromProp = item?.config?.details?.value?.value
  const displayDate = valueFromProp ? dayjs(valueFromProp) : null

  // State ชั่วคราวสำหรับจัดการค่าในปฏิทิน
  const [tempValue, setTempValue] = useState<Dayjs | null>(displayDate)

  const [open, setOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef<any>(null)

  const errors = useFormStore(state => state.errors)
  const key = `${parentKey}-${boxId}-${item?.id}`
  const errorInput = errors[key]

  // ฟังก์ชันสำหรับซิงค์ค่าล่าสุดจาก props และเปิดปฏิทิน
  const handleOpen = () => {
    setTempValue(displayDate) // ซิงค์ค่าล่าสุดเสมอเมื่อเปิด
    setOpen(true)
  }

  // ฟังก์ชันสำหรับจัดการเมื่อกด "OK"
  const handleAccept = (newDate: Dayjs | null) => {
    const formattedDate = newDate ? newDate.format('YYYY-MM-DDTHH:mm:ss') : ''
    updateValueOnly(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', formattedDate)
    setOpen(false) // ปิดปฏิทิน
  }

  // ฟังก์ชันสำหรับจัดการเมื่อกด "Cancel" หรือปิดไป
  const handleClose = () => {
    setOpen(false)
  }

  const handleClear = (e: any) => {
    // 👈 เพิ่มฟังก์ชัน handleClear
    e.stopPropagation()
    updateValueOnly(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', '')
    setTempValue(null)
  }

  return (
    <div style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControl
        className='flex-wrap flex-row w-full'
        // error={errorInput}
        fullWidth
        sx={{
          ...(errorInput && {
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: 1
          })
        }}
      >
        <LocalizationProvider dateAdapter={newAdapter} adapterLocale='th'>
          {item?.config?.details?.tag?.isShow && (
            <Typography variant='body2'>{item?.config?.details?.tag?.value ?? 'เลือกวันที่'}</Typography>
          )}

          <MobileDateTimePicker
            disabled={!item?.config?.details?.isUse}
            open={open}
            // ปรับ Props ทั้งหมดเพื่อใช้ State ชั่วคราว
            onOpen={handleOpen}
            onClose={handleClose}
            value={tempValue} // ใช้ state ชั่วคราว
            onChange={newDate => setTempValue(newDate)} // อัปเดตแค่ state ชั่วคราว
            onAccept={handleAccept} // ใช้ onAccept เมื่อกดยืนยัน
            format='DD/MM/YYYY HH:mm'
            slotProps={{
              textField: {
                // ทำให้ text field อ่านได้อย่างเดียว
                inputProps: {
                  readOnly: true
                },
                onClick: handleOpen,
                size: 'small',
                fullWidth: true,
                inputRef,
                placeholder: 'กรุณาเลือกวันที่',
                label: displayDate
                  ? ''
                  : item?.config?.details?.placeholder?.isShow
                    ? item?.config?.details?.placeholder?.value
                    : '',
                onFocus: () => setIsFocus(true),
                onBlur: () => {
                  if (isFocus) setIsFocus(false)
                },
                InputLabelProps: {
                  shrink: isFocus || (open && true)
                },
                InputProps: {
                  // 👈 เพิ่ม InputProps
                  endAdornment: displayDate && (
                    <InputAdornment position='end'>
                      <IconButton aria-label='clear date' onClick={handleClear} edge='end' size='small'>
                        <ClearIcon fontSize='small' />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }
            }}
          />
          {item?.config?.details?.helperText?.isShow && (
            <Typography variant='body2'>{item?.config?.details?.helperText?.value ?? 'คำแนะนำ'}</Typography>
          )}
        </LocalizationProvider>
      </FormControl>
    </div>
  )
}

export default DatetimePickerForm

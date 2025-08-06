'use client'

import { useState, useRef, useEffect } from 'react'
import { Typography } from '@mui/material'
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'
import { useFormStore } from '@/store/useFormStore'
import FormControl from '@mui/material/FormControl'
const DatePickerForm = ({ item, parentKey, boxId, draft }: any) => {
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const valueFromProp = item?.config?.details?.value?.value
  const displayDate = valueFromProp ? dayjs(valueFromProp) : null

  const [tempValue, setTempValue] = useState<Dayjs | null>(displayDate)
  const [open, setOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef<any>(null)

  const errors = useFormStore(state => state.errors)
  const key = `${parentKey}-${boxId}-${item?.id}`
  const errorInput = errors[key]

  // 👉 Step 1: ลบ useEffect ออก
  // useEffect(() => {
  //   setTempValue(displayDate)
  // }, [displayDate])

  // 👉 Step 2: สร้างฟังก์ชัน handleOpen เพื่อซิงค์ข้อมูลก่อนเปิด
  const handleOpen = () => {
    setTempValue(displayDate) // ซิงค์ค่าล่าสุดจาก props มาใส่ใน state ชั่วคราว
    setOpen(true)
  }

  const handleAccept = (newDate: Dayjs | null) => {
    const formattedDate = newDate ? newDate.format('YYYY-MM-DDTHH:mm:ss') : ''
    updateValueOnly(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', formattedDate)
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
    // ไม่จำเป็นต้อง setTempValue ที่นี่แล้ว เพราะ handleOpen จะจัดการให้ในครั้งถัดไป
  }

  return (
    <div className='w-[170px]' style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <FormControl
        className='flex-wrap flex-row w-full'
        // error={errorInput}
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

          <MobileDatePicker
            disabled={!item?.config?.details?.isUse}
            open={open}
            // 👉 Step 3: เปลี่ยนมาใช้ handleOpen
            onOpen={handleOpen}
            onClose={handleClose}
            value={tempValue}
            onChange={newDate => setTempValue(newDate)}
            onAccept={handleAccept}
            format='DD/MM/YYYY'
            slotProps={{
              textField: {
                inputProps: {
                  readOnly: true
                },
                onClick: handleOpen, // ใช้ handleOpen ที่นี่ด้วยก็ได้
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

export default DatePickerForm

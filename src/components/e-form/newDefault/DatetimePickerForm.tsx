'use client'

import { useState, useRef } from 'react'
import { Typography } from '@mui/material'
import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import newAdapter from '@/libs/newAdapter'
import { useFormStore } from '@/store/useFormStore'

const DatetimePickerForm = ({ item }: any) => {
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const selectedField = useFormStore(state => state.selectedField)
  // const [date, setDate] = useState<Dayjs | null>(null)
  const [date, setDate] = useState<Dayjs | null>(() => {
    const val = item?.config?.details?.value?.value

    if (item?.config?.details?.value?.valueType === 'variable') {
      return dayjs(val?.value) ?? null
    }

    return val ? dayjs(val) : null
  })
  const [open, setOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef<any>(null)

  const handleChange = (newDate: Dayjs | null) => {
    setDate(newDate)
    setOpen(false)
    if (newDate) {
      const formattedDate = newDate.format('YYYY-MM-DDTHH:mm:ss')
      updateValueOnly(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', formattedDate)
    }
  }

  return (
    <div
      onDoubleClick={() => {
        if (!item?.config?.details?.isUse) return
        setOpen(true)
      }}
      className='w-[170px]'
      style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}
    >
      <LocalizationProvider dateAdapter={newAdapter} adapterLocale='th'>
        {item?.config?.details?.tag?.isShow && (
          <Typography variant='body2'>{item?.config?.details?.tag?.value ?? 'เลือกวันที่'}</Typography>
        )}
        <MobileDateTimePicker
          disabled={!item?.config?.details?.isUse}
          open={open}
          onClose={() => setOpen(false)}
          value={date}
          onChange={handleChange}
          format='DD/MM/YYYY HH:mm'
          // label={date ? '' : item?.config?.details?.placeholder?.value}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              inputRef,
              placeholder: 'กรุณาเลือกวันที่',
              label: date
                ? ''
                : item?.config?.details?.placeholder?.isShow
                  ? item?.config?.details?.placeholder?.value
                  : '',
              onFocus: () => {
                setIsFocus(true)
              },
              onBlur: () => {
                if (isFocus) setIsFocus(false)
              },
              InputLabelProps: {
                shrink: isFocus || (open && true)
              },
              InputProps: {
                sx: {
                  '& .MuiInputAdornment-root': {
                    display: 'none'
                  }
                }
              }
            }
          }}
        />
        {item?.config?.details?.helperText?.isShow && (
          <Typography variant='body2'>{item?.config?.details?.helperText?.value ?? 'คำแนะนำ'}</Typography>
        )}
      </LocalizationProvider>
    </div>
  )
}

export default DatetimePickerForm

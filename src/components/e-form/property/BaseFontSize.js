'use client'

import React, { useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { useFormStore } from '@/store/useFormStore'

const BaseFontSize = ({ placeholder, value }) => {
  const updateStyle = useFormStore(state => state.updateStyle)
  const selectedField = useFormStore(state => state.selectedField)

  const handleChangeFontsize = e => {
    const rawValue = e.target.value

    if (/^\d*$/.test(rawValue) && rawValue.length <= 2) {
      const fontSize = parseInt(rawValue, 10) || 0 // convert to number, fallback to 0 if empty
      updateStyle(selectedField.parentKey, selectedField.boxId, selectedField.fieldId.id, { fontSize })
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <Typography fontSize={13} color='text.primary'>
        ขนาดตัวอักษร
      </Typography>
      <OutlinedInput
        placeholder={placeholder}
        value={value || ''}
        endAdornment={<InputAdornment position='end'>px</InputAdornment>}
        className='h-[36px]'
        onChange={handleChangeFontsize}
        inputProps={{
          inputMode: 'numeric',
          pattern: '\\d*',
          maxLength: 2
        }}
      />
    </div>
  )
}

export default BaseFontSize

'use client'
import React, { useState } from 'react'

import { Typography } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { useFormStore } from '@/store/useFormStore'

const BaseColorPicker = ({ label, defaultColor = '#000000' }) => {
  const [color, setColor] = useState(defaultColor)

  const updateStyle = useFormStore(state => state.updateStyle)
  const selectedField = useFormStore(state => state.selectedField)

  const handleColorChange = e => {
    setColor(e.target.value)

    updateStyle(selectedField.parentKey, selectedField.boxId, selectedField.fieldId.id, { color: e.target.value })
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='flex flex-col items-center justify-end'>
        <Typography variant='caption' color='text.primary'>
          {label}
        </Typography>

        <div
          style={{
            position: 'relative',
            width: '34px',
            height: '34px',
            backgroundColor: color,
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {/* Hidden Input for Color Picker */}
          <input
            type='color'
            value={color}
            onChange={handleColorChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Input Field */}
      {/* <TextField
        variant='outlined'
        value={color}
        onChange={handleColorChange}
        inputProps={{ maxLength: 7 }}
        style={{ width: '120px' }}
      /> */}
      <div className='flex h-full items-end'>
        <CustomTextField value={color} placeholder='Placeholder' onChange={handleColorChange} />
      </div>
    </div>
  )
}

export default BaseColorPicker

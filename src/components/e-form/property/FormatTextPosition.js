'use client'

import React from 'react'
import { Typography } from '@mui/material'
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight } from '@mui/icons-material'
import BaseButton from '@/components/ui/button/BaseButton'
import { useFormStore } from '@/store/useFormStore'

const FormatTextPosition = ({ item, id }) => {
  const updateStyle = useFormStore(state => state.updateStyle)
  const selectedField = useFormStore(state => state.selectedField)

  const handleShowStyle = style => {
    return item?.textAlign === style ? 'primary' : 'secondary'
  }

  const handleSelectStyle = textAlign => {
    if (!selectedField?.parentKey || !selectedField?.boxId || !selectedField?.fieldId?.id) return

    updateStyle(selectedField.parentKey, selectedField.boxId, selectedField.fieldId.id, { textAlign })
  }

  return (
    <div className='flex flex-col'>
      <Typography color='text.primary' gutterBottom>
        การจัดวาง
      </Typography>
      <div className='flex gap-4'>
        <BaseButton
          icon={FormatAlignLeft}
          iconPosition='right'
          color={handleShowStyle('start')}
          sx={{ width: '30px' }}
          onClick={() => handleSelectStyle('start')}
        />
        <BaseButton
          icon={FormatAlignCenter}
          iconPosition='right'
          color={handleShowStyle('center')}
          sx={{ width: '30px' }}
          onClick={() => handleSelectStyle('center')}
        />
        <BaseButton
          icon={FormatAlignRight}
          iconPosition='right'
          color={handleShowStyle('end')}
          sx={{ width: '30px' }}
          onClick={() => handleSelectStyle('end')}
        />
      </div>
    </div>
  )
}

export default FormatTextPosition

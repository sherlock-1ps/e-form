'use client'
import React from 'react'
import { useDispatch } from 'react-redux'

import { Typography } from '@mui/material'
import { FormatBold, FormatItalic, StrikethroughS, FormatUnderlined } from '@mui/icons-material'
import BaseButton from '@/components/ui/button/BaseButton'
import { useFormStore } from '@/store/useFormStore'
import { useDictionary } from '@/contexts/DictionaryContext'

const FormatText = ({ item, id }) => {
  const { dictionary } = useDictionary()
  const updateStyle = useFormStore(state => state.updateStyle)
  const getSelectedDataItem = useFormStore(state => state.getSelectedDataItem)
  const selectedField = useFormStore(state => state.selectedField)

  const handleShowStyle = style => {
    if (item?.fontWeight === style) {
      return 'primary'
    }
    if (item?.fontStyle === style) {
      return 'primary'
    }
    if (item?.textDecoration === style) {
      return 'primary'
    }

    return 'secondary'
  }

  const handleSelectStyle = style => {
    const selected = getSelectedDataItem()
    const currentStyle = selected?.config?.style || {}

    const styleMap = {
      bold: { fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold' },
      italic: { fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic' },
      underline: {
        textDecoration: currentStyle.textDecoration === 'underline' ? 'none' : 'underline'
      },
      'line-through': {
        textDecoration: currentStyle.textDecoration === 'line-through' ? 'none' : 'line-through'
      }
    }

    updateStyle(
      selectedField?.parentKey ?? '',
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      styleMap[style]
    )
  }

  return (
    <div className='flex flex-col'>
      <Typography color='text.primary' gutterBottom>
        {dictionary?.style}
      </Typography>
      <div className='flex gap-4'>
        <BaseButton
          icon={FormatBold}
          iconPosition='right'
          color={handleShowStyle('bold')}
          sx={{ width: '30px' }}
          onClick={() => {
            handleSelectStyle('bold')
          }}
        />
        <BaseButton
          icon={FormatItalic}
          iconPosition='right'
          color={handleShowStyle('italic')}
          sx={{ width: '30px' }}
          onClick={() => {
            handleSelectStyle('italic')
          }}
        />
        <BaseButton
          icon={StrikethroughS}
          iconPosition='right'
          color={handleShowStyle('line-through')}
          sx={{ width: '30px' }}
          onClick={() => {
            handleSelectStyle('line-through')
          }}
        />
        <BaseButton
          icon={FormatUnderlined}
          iconPosition='right'
          color={handleShowStyle('underline')}
          sx={{ width: '30px' }}
          onClick={() => {
            handleSelectStyle('underline')
          }}
        />
      </div>
    </div>
  )
}

export default FormatText

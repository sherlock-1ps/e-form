'use client'
import { useEffect, useState } from 'react'
import { AddBoxOutlined, Delete } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import CustomTextField from '@core/components/mui/TextField'
import { Button, FormControlLabel, IconButton, InputAdornment, Radio, RadioGroup } from '@mui/material'
import { useFormStore } from '@/store/useFormStore'
import type { TextFieldProps } from '@mui/material/TextField'

const ColumnBoxProperty = () => {
  const selectedField = useFormStore(state => state.selectedField)
  const form = useFormStore(state => state.form)
  const updatePadding = useFormStore(state => state.updatePadding)

  const resultBoxid = form?.form_details
    .flatMap(formItem => formItem.fields)
    .find(item => item.i == selectedField?.boxId)

  const handleChange = (event: any) => {
    const mode = event.target.value
    const parentKey = String(selectedField?.parentKey ?? '')
    const boxId = selectedField?.boxId ?? ''

    if (mode === 'all') {
      updatePadding(parentKey, boxId, {
        allPadding: 'all',
        top: resultBoxid?.padding?.top ?? 0
      })
    } else {
      updatePadding(parentKey, boxId, {
        allPadding: 'custom'
      })
    }
  }

  const handleChangeAll = (e: any) => {
    const value = Number(e.target.value)
    const parentKey = String(selectedField?.parentKey ?? '')
    const boxId = selectedField?.boxId ?? ''

    updatePadding(parentKey, boxId, {
      top: value,
      bottom: value,
      left: value,
      right: value
    })
  }

  const handlePaddingChange = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
    const cleaned = value.replace(/^0+(?=\d)/, '')
    const parsed = Number(cleaned)
    const parentKey = String(selectedField?.parentKey ?? '')
    const boxId = selectedField?.boxId ?? ''

    if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) {
      updatePadding(parentKey, boxId, { [side]: parsed })
    }
  }

  return (
    <div>
      <section
        className='w-full h-[86px] flex justify-center items-center py-4 px-6'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='flex-1 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <AddBoxOutlined sx={{ width: '32px', height: '32px' }} />
            <Typography variant='h5'>Box</Typography>
          </div>
        </div>
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='w-full flex justify-between items-center'>
          <CustomTextField label='Box ID' placeholder='Placeholder' value={selectedField?.boxId} disabled />
        </div>
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Typography variant='h6'>กำหนดระยะ Padding</Typography>

        <RadioGroup row value={resultBoxid?.padding?.allPadding} onChange={handleChange}>
          <FormControlLabel value='all' control={<Radio />} label='ทุกด้าน' />
          <FormControlLabel value='custom' control={<Radio />} label='แต่ละด้าน' />
        </RadioGroup>
        <CustomTextField
          fullWidth
          type='number'
          label='ทุกด้าน'
          value={resultBoxid?.padding?.allPadding == 'all' ? resultBoxid?.padding?.top || '' : ''}
          disabled={resultBoxid?.padding?.allPadding !== 'all'}
          onChange={handleChangeAll}
          InputProps={{
            endAdornment: <p>px</p>,
            inputProps: {
              min: 0,
              max: 99
            }
          }}
        />

        <div className='flex gap-2'>
          <CustomTextField
            fullWidth
            type='text'
            label='ด้านบน'
            value={String(resultBoxid?.padding?.top ?? '')}
            disabled={resultBoxid?.padding?.allPadding === 'all'}
            onChange={e => {
              const raw = e.target.value
              const cleaned = raw.replace(/^0+(?=\d)/, '')
              const parsed = Number(cleaned)

              if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) {
                handlePaddingChange('top', cleaned)
              }
            }}
            InputProps={{
              endAdornment: <p>px</p>,
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 0,
                max: 99
              }
            }}
          />
          <CustomTextField
            fullWidth
            type='text'
            label='ด้านล่าง'
            value={String(resultBoxid?.padding?.bottom ?? '')}
            disabled={resultBoxid?.padding?.allPadding === 'all'}
            onChange={e => {
              const raw = e.target.value
              const cleaned = raw.replace(/^0+(?=\d)/, '')
              const parsed = Number(cleaned)

              if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) {
                handlePaddingChange('bottom', cleaned)
              }
            }}
            InputProps={{
              endAdornment: <p>px</p>,
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 0,
                max: 99
              }
            }}
          />
        </div>
        <div className='flex gap-2'>
          <CustomTextField
            fullWidth
            type='text'
            label='ด้านซ้าย'
            value={String(resultBoxid?.padding?.left ?? '')}
            disabled={resultBoxid?.padding?.allPadding === 'all'}
            onChange={e => {
              const raw = e.target.value
              const cleaned = raw.replace(/^0+(?=\d)/, '')
              const parsed = Number(cleaned)

              if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) {
                handlePaddingChange('left', cleaned)
              }
            }}
            InputProps={{
              endAdornment: <p>px</p>,
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 0,
                max: 99
              }
            }}
          />

          <CustomTextField
            fullWidth
            type='text'
            label='ด้านขวา'
            value={String(resultBoxid?.padding?.right ?? '')}
            disabled={resultBoxid?.padding?.allPadding === 'all'}
            onChange={e => {
              const raw = e.target.value
              const cleaned = raw.replace(/^0+(?=\d)/, '')
              const parsed = Number(cleaned)

              if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) {
                handlePaddingChange('right', cleaned)
              }
            }}
            InputProps={{
              endAdornment: <p>px</p>,
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 0,
                max: 99
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default ColumnBoxProperty

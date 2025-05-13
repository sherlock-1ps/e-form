'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { FullscreenExitOutlined, ImageOutlined, FitScreenOutlined, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import { formSizeConfig } from '@configs/formSizeConfig'

const ImageProperty = ({ item }) => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateStyle = useFormStore(state => state.updateStyle)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  return (
    <div>
      <BaseTitleProperty
        title='รูปภาพ'
        icon={<ImageOutlined sx={{ width: '32px', height: '32px' }} />}
        item={selectedField}
      />

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        {/* <BaseDropdown label='ตำแหน่ง' options={options} defaultValue='canvas' /> */}
        <div className='w-full flex justify-around'>
          <FormControlLabel
            label='เปิดใช้งาน'
            control={
              <Checkbox
                checked={result?.config?.details?.isUse}
                onChange={e =>
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      isUse: !result?.config?.details?.isUse
                    }
                  )
                }
              />
            }
          />

          <FormControlLabel
            label='แสดงผล'
            control={
              <Checkbox
                checked={result?.config?.details?.isShow}
                onChange={e =>
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      isShow: !result?.config?.details?.isShow
                    }
                  )
                }
              />
            }
          />
        </div>
        <CustomTextField label='Component ID' placeholder='Placeholder' value={selectedField?.fieldId?.id} />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Typography color='text.primary'>ขนาดการแสดงผล</Typography>
        <div className='flex gap-2'>
          <CustomTextField
            type='number'
            label='กว้าง'
            placeholder='100%'
            value={result?.config?.style?.width ?? ''}
            inputProps={{ max: formSizeConfig.width }}
            InputProps={{
              endAdornment: result?.config?.style?.width ? <p>px</p> : undefined
            }}
            onChange={e => {
              const raw = e.target.value
              const value = raw === '' ? '' : Math.min(Number(raw), formSizeConfig.width)

              updateStyle(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                { width: value }
              )
            }}
          />
          <CustomTextField
            type='number'
            label='สูง'
            placeholder='AUTO'
            value={result?.config?.style?.height ?? ''}
            InputProps={{
              endAdornment: result?.config?.style?.height ? <p>px</p> : undefined
            }}
            onChange={e => {
              const raw = e.target.value
              const value = raw === '' ? '' : Math.min(Number(raw))

              updateStyle(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                { height: value }
              )
            }}
          />
        </div>
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <CustomTextField select fullWidth defaultValue='' label='เลือกรูปภาพ' id='select-position'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </CustomTextField>
        <div className='w-full flex items-center justify-between'>
          <Typography color='text.primary'>การขยายภาพ</Typography>
          <div className='flex items-center justify-center gap-2'>
            <BaseButton
              color={result?.config?.style?.objectFit == 'contain' ? 'primary' : 'secondary'}
              text=''
              icon={FitScreenOutlined}
              sx={{ width: '26px', height: '26px' }}
              onClick={() => {
                updateStyle(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  { objectFit: 'contain' }
                )
              }}
            />
            <BaseButton
              color={result?.config?.style?.objectFit == 'cover' ? 'primary' : 'secondary'}
              text=''
              icon={FullscreenExitOutlined}
              sx={{ width: '26px', height: '26px' }}
              onClick={() => {
                updateStyle(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  { objectFit: 'cover' }
                )
              }}
            />
          </div>
        </div>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
        {/* <div className='flex items-center gap-2'>
          <BaseButton text='เปลี่ยนแปลง' sx={{ display: 'flex', flex: 1 }} />
          <BaseButton text='ลบ' icon={Delete} iconPosition='right' color='error' sx={{ display: 'flex', flex: 1 }} />
        </div> */}
      </section>
    </div>
  )
}

export default ImageProperty

'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { FullscreenExitOutlined, UploadFileOutlined, FitScreenOutlined, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import { formSizeConfig } from '@configs/formSizeConfig'
import { useDialog } from '@/hooks/useDialog'
import SelectFileUploadDialog from '@/components/dialogs/form/SelectFileUploadDialog'

const UploadProperty = () => {
  const { showDialog } = useDialog()
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
        title='ไฟล์อัปโหลด'
        icon={<UploadFileOutlined sx={{ width: '32px', height: '32px' }} />}
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
        <CustomTextField select fullWidth defaultValue='' label='ประเภทข้อมูล' id='select-position'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>ไฟล์</MenuItem>
        </CustomTextField>
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.placeholder?.isShow} />}
          label='ข้อความที่แสดง'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                placeholder: {
                  ...result?.config?.details?.placeholder,
                  isShow: e.target.checked
                }
              }
            )
          }
        />
        <CustomTextField
          label='ข้อความที่แสดง'
          placeholder='Placeholder'
          value={result?.config?.details?.placeholder?.value}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                placeholder: {
                  ...result?.config?.details?.placeholder,
                  value: e.target.value
                }
              }
            )
          }
        />
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
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5 '>
        <Typography color='text.primary'>การตรวจสอบข้อมูล</Typography>
        <div className='flex  gap-2 justify-between items-center '>
          <Typography variant='body1'>กำหนดประเภทไฟล์</Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              showDialog({
                id: 'alertSelectFileUploadDialog',
                component: <SelectFileUploadDialog id='alertSelectFileUploadDialog' onClick={() => {}} />,
                size: 'sm'
              })
            }}
          >
            เลือก
          </Button>
        </div>
        <div className='flex  gap-2 justify-between items-center '>
          <Typography variant='body1' className=' text-nowrap'>
            ขนาดสูงสุดต่อไฟล์
          </Typography>
          <CustomTextField
            type='number'
            value={result?.config?.details?.maxSize || ''}
            InputProps={{
              endAdornment: <p>MB</p>,
              inputProps: {
                min: 1,
                max: 20
              }
            }}
            onChange={e => {
              const raw = e.target.value
              const num = Number(raw)
              const value = raw === '' ? '' : Math.min(Math.max(num, 1), 20)

              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  maxSize: value
                }
              )
            }}
          />
        </div>

        <div className='flex  gap-1 justify-between items-center '>
          <FormControlLabel
            control={
              <Switch
                checked={result?.config?.details?.maxFileUpload > 0}
                onChange={e => {
                  updateDetails(
                    String(selectedField?.parentKey ?? ''),
                    selectedField?.boxId ?? '',
                    selectedField?.fieldId?.id ?? '',
                    {
                      maxFileUpload: e.target.checked ? 50 : undefined
                    }
                  )
                }}
              />
            }
            label='รองรับการอัปโหลดหลายไฟล์'
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '12.5px',
                whiteSpace: 'nowrap'
              }
            }}
          />
          <CustomTextField
            select
            value={result?.config?.details?.maxFileUpload ?? ''}
            fullWidth
            type='number'
            label='จำนวนสูงสุด'
            onChange={e => {
              const value = Number(e.target.value)
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  maxFileUpload: value
                }
              )
            }}
          >
            <MenuItem value='' disabled>
              เลือก
            </MenuItem>

            {Array.from({ length: 50 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </CustomTextField>
        </div>

        <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
      </section>
    </div>
  )
}

export default UploadProperty

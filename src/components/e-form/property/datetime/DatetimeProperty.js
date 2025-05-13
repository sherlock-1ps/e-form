'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { FullscreenExitOutlined, EditCalendarOutlined, FitScreenOutlined, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'
import { useFormStore } from '@/store/useFormStore.ts'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'

const DatetimeProperty = () => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  return (
    <div>
      <BaseTitleProperty
        title='วันที่และเวลา'
        icon={<EditCalendarOutlined sx={{ width: '32px', height: '32px' }} />}
        item={selectedField}
      />

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
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
        <CustomTextField select fullWidth defaultValue='' label='ประเภทข้อมูล' id='select-position'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>วันที่</MenuItem>
        </CustomTextField>
        <CustomTextField select fullWidth defaultValue='' label='เก็บข้อมูลไปที่' id='select-position'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </CustomTextField>
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.tag?.isShow} />}
          label='ป้ายกำกับ'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                tag: {
                  ...result?.config?.details?.tag,
                  isShow: e.target.checked
                }
              }
            )
          }
        />
        <CustomTextField
          label='ข้อความที่แสดง'
          placeholder='Placeholder'
          value={result?.config?.details?.tag?.value}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                tag: {
                  ...result?.config?.details?.tag,
                  value: e.target.value
                }
              }
            )
          }
        />
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.placeholder?.isShow} />}
          label='ข้อความตัวอย่าง'
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
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.helperText?.isShow} />}
          label='ข้อความช่วยเหลือ'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                helperText: {
                  ...result?.config?.details?.helperText,
                  isShow: e.target.checked
                }
              }
            )
          }
        />
        <CustomTextField
          label='ข้อความที่แสดง'
          placeholder='Placeholder'
          value={result?.config?.details?.helperText?.value}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                helperText: {
                  ...result?.config?.details?.helperText,
                  value: e.target.value
                }
              }
            )
          }
        />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Typography variant='h6'>การตรวจสอบข้อมูล</Typography>
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.isRequired} />}
          label='จำเป็นต้องกรอก'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                isRequired: e.target.checked
              }
            )
          }
        />
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
      </section>
    </div>
  )
}

export default DatetimeProperty

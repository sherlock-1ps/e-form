'use client'
import { useState } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { RadioButtonCheckedOutlined, Delete, ArrowDownward, ArrowForward } from '@mui/icons-material'
import Switch from '@mui/material/Switch'
import { useDispatch } from 'react-redux'

import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import ChoiceBox from '@/components/e-form/property/select/ChoiceBox'
import { useFormStore } from '@/store/useFormStore.ts'

const RadioProperty = () => {
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
        title='ตัวเลือก: เลือก 1'
        icon={<RadioButtonCheckedOutlined sx={{ width: '24px', height: '24px' }} />}
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
        <Typography>การตรวจสอบข้อมูล</Typography>
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
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='w-full flex items-center justify-between'>
          <Typography color='text.primary'>การจัดเรียงตัวเลือก</Typography>
          <div className='flex items-center justify-center gap-2'>
            <BaseButton
              color={result?.config?.details?.row ? 'secondary' : 'primary'}
              text=''
              icon={ArrowDownward}
              sx={{ width: '26px', height: '26px' }}
              onClick={() => {
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    row: false
                  }
                )
              }}
            />
            <BaseButton
              color={result?.config?.details?.row ? 'primary' : 'secondary'}
              text=''
              icon={ArrowForward}
              sx={{ width: '26px', height: '26px' }}
              onClick={() => {
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    row: true
                  }
                )
              }}
            />
          </div>
        </div>
        <ChoiceBox item={result} />
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
      </section>
    </div>
  )
}

export default RadioProperty

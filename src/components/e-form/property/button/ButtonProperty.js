'use client'
import { useState, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, MenuItem } from '@mui/material'
import { CloseOutlined, SmartButtonOutlined, Add, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import { formSizeConfig } from '@configs/formSizeConfig'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 550, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const ButtonProperty = () => {
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
        title='ปุ่ม'
        icon={<SmartButtonOutlined sx={{ width: '32px', height: '32px' }} />}
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
        <Typography>ขนาดการแสดงผล</Typography>
        <div className='flex gap-2'>
          <CustomTextField
            type='number'
            label='กว้าง'
            placeholder='DEFAULT'
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
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <CustomTextField select fullWidth defaultValue={10} label='ประเภทปุ่ม' id='select-position'>
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>ข้อความ</MenuItem>
          <MenuItem value={20}>ตัวเลข</MenuItem>
        </CustomTextField>
        <div className='p-2 bg-primaryLighter rounded-md'>
          <Typography variant='body2'>ข้อความในปุ่ม</Typography>
          <RadioGroup row defaultValue='checked' name='basic-radio' aria-label='basic-radio'>
            <FormControlLabel value='checked' control={<Radio />} label='String' />
            <FormControlLabel value='unchecked' control={<Radio />} label='Variable' />
            <FormControlLabel value='test' control={<Radio />} label='API' />
          </RadioGroup>

          <DebouncedInput
            label='รายละเอียด'
            placeholder={result.config.details.placeholder}
            value={result.config.details.value || ''}
            onChange={newText =>
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  value: newText
                }
              )
            }
          />
        </div>
        <div>
          <FormatText item={result?.config?.style} id={selectedField?.fieldId?.id} />
        </div>
        <div>
          <FormatTextPosition item={result?.config?.style} id={selectedField?.fieldId?.id} />
        </div>
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
      </section>
    </div>
  )
}

export default ButtonProperty

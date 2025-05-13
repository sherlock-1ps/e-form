'use client'
import { useState, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { Title, Delete, InsertLinkOutlined } from '@mui/icons-material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'

import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import BaseDropdown from '@components/e-form/property/BaseDropdown'
import BaseColorPicker from '@components/e-form/property/BaseColorPicker'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import BaseFontSize from '@components/e-form/property/BaseFontSize'
import { useFormStore } from '@/store/useFormStore.ts'

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

const LinkProperty = () => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const handleChangeInput = e => {
    const newValue = e.target.value
  }

  const handleChange = e => {
    const value = e.target.value === 'true'
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      { isCutLink: value }
    )
  }

  return (
    <div>
      <BaseTitleProperty
        title='ลิงก์'
        icon={<InsertLinkOutlined sx={{ width: '32px', height: '32px' }} />}
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
        <RadioGroup row defaultValue='checked' name='basic-radio' aria-label='basic-radio'>
          <FormControlLabel value='checked' control={<Radio />} label='String' />
          <FormControlLabel value='unchecked' control={<Radio />} label='AppState' />
          <FormControlLabel value='test' control={<Radio />} label='API' />
        </RadioGroup>

        <DebouncedInput
          label='URL'
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
        <div className='flex gap-1'>
          <BaseFontSize placeholder={result.config.style.fontSize} value={result.config.style.fontSize} />
          <BaseColorPicker label='สี' defaultColor={result.config.style.color} />
        </div>
        <FormatText item={result.config.style} />
        <FormatTextPosition item={result.config.style} />
        <RadioGroup
          row={false}
          value={result?.config?.details?.isCutLink ?? false}
          name='basic-radio'
          onChange={handleChange}
          aria-label='basic-radio'
        >
          <FormControlLabel value={false} control={<Radio />} label='ขยายกล่องตามข้อความ' />
          <FormControlLabel value={true} control={<Radio />} label='ตัดข้อความตามขนาดกล่อง' />
        </RadioGroup>
      </section>

      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
        <div>
          <FormControlLabel control={<Switch defaultChecked />} label='Trigger Event' />
        </div>
      </section>
    </div>
  )
}

export default LinkProperty

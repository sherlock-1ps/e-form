'use client'
import { useState, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { Title, Delete } from '@mui/icons-material'
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

const EditorProperty = ({ item }) => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  return (
    <div>
      <BaseTitleProperty title='Editor' icon={<Title sx={{ width: '32px', height: '32px' }} />} item={selectedField} />
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
                  updateDetails(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', {
                    isUse: !result?.config?.details?.isUse
                  })
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
                  updateDetails(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', {
                    isShow: !result?.config?.details?.isShow
                  })
                }
              />
            }
          />
        </div>
        <CustomTextField label='Component ID' placeholder='Placeholder' value={item.id} />
      </section>
    </div>
  )
}

export default EditorProperty

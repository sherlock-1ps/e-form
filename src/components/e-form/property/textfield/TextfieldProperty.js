'use client'
import { useState, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, MenuItem } from '@mui/material'
import { TextFieldsOutlined, Add, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import BaseColorPicker from '@components/e-form/property/BaseColorPicker'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import BaseFontSize from '@components/e-form/property/BaseFontSize'

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

const TextfieldProperty = () => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const handleChangeInput = (e, key) => {
    // dispatch(
    //   setValueElementObject({
    //     id: item.id,
    //     key: key,
    //     value: e.target.value
    //   })
    // )
  }

  const handleToggle = key => {
    // dispatch(
    //   updateBooleanElement({
    //     id: item.id,
    //     key: key
    //   })
    // )
  }

  return (
    <div>
      <BaseTitleProperty
        title='กล่องข้อความ'
        icon={<TextFieldsOutlined sx={{ width: '32px', height: '32px' }} />}
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
        <div className='flex gap-1'>
          <BaseFontSize placeholder={result.config.style.fontSize} value={result.config.style.fontSize} />
          <BaseColorPicker label='สี' defaultColor={result.config.style.color} />
        </div>
        <div>
          <FormatText item={result.config.style} />
        </div>
        <div>
          <FormatTextPosition item={result.config.style} />
        </div>
        <DebouncedInput
          label='ข้อความ'
          placeholder={result?.config?.details?.placeholder?.value}
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
        <Typography>การแสดงผล</Typography>
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

        <div className='flex'>
          <div className='flex w-full'>
            <FormControlLabel
              control={
                <Switch
                  checked={result?.config?.details?.limit?.isLimit ?? false}
                  onChange={e =>
                    updateDetails(
                      String(selectedField?.parentKey ?? ''),
                      selectedField?.boxId ?? '',
                      selectedField?.fieldId?.id ?? '',
                      {
                        limit: {
                          ...result?.config?.details?.limit,
                          isLimit: e.target.checked
                        }
                      }
                    )
                  }
                />
              }
              label='จำกัดจำนวน'
            />
          </div>
          <CustomTextField
            label='จำนวนตัวอักษร'
            placeholder='123...'
            type='number'
            value={result?.config?.details?.limit?.maxCharacter ?? ''}
            onChange={e =>
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  limit: {
                    ...result?.config?.details?.limit,
                    maxCharacter: e.target.value
                  }
                }
              )
            }
          />
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

export default TextfieldProperty

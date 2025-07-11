'use client'
import { useState, useEffect, useMemo } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, MenuItem, Button } from '@mui/material'
import { TextFieldsOutlined, Add, Delete } from '@mui/icons-material'
import Switch from '@mui/material/Switch'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import { useFormStore } from '@/store/useFormStore.ts'
import BaseColorPicker from '@components/e-form/property/BaseColorPicker'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import BaseFontSize from '@components/e-form/property/BaseFontSize'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import Autocomplete from '@mui/material/Autocomplete'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 550, maxLength, ...props }) => {
  const { dictionary } = useDictionary() // dictionary ถูกใช้ใน JSX ไม่ได้ใช้ใน effect นี้
  const [value, setValue] = useState(initialValue)

  // Effect สำหรับอัปเดต internal state 'value' เมื่อ 'initialValue' เปลี่ยน
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Effect สำหรับ debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      // เพิ่มการตรวจสอบ type ของ onChange เพื่อความปลอดภัย
      if (typeof onChange === 'function') {
        onChange(value)
      } else {
        console.warn('onChange prop is not a function in DebouncedInput')
      }
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce]) // <-- **แก้ไขตรงนี้: เพิ่ม onChange และ debounce**

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => {
        const input = e.target.value
        if (!isEng) {
          setValue(input)
          return
        }
        const isValid = /^[a-zA-Z0-9]*$/.test(input)
        if (isValid) {
          setValue(input)
        }
      }}
      inputProps={{
        ...(maxLength ? { maxLength } : {}),
        ...(props.inputProps || {})
      }}
    />
  )
}

const TextfieldProperty = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateId = useFormStore(state => state.updateId)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const [isDuplicateId, setIsDuplicatedId] = useState(false)
  const { data: variableData } = useFetchVariableQueryOption(1, 999)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const allIds = useMemo(() => {
    return form.form_details.flatMap(section => section.fields.flatMap(field => field.data.map(item => item.id)))
  }, [form])

  useEffect(() => {
    if (selectedField) {
      // เพิ่มเงื่อนไขตรวจสอบ selectedField เพื่อความปลอดภัย
      setIsDuplicatedId(false)
    }
  }, [selectedField])

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
            label={dictionary?.enable}
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
            label={dictionary?.display}
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
        <DebouncedInput
          label='Component ID'
          placeholder='Placeholder'
          value={result?.id}
          error={isDuplicateId}
          maxLength={25}
          isEng
          onChange={newValue => {
            if (newValue === result?.id) return

            if (allIds.includes(newValue)) {
              toast.error('ID ซ้ำ กรุณาใช้ ID อื่น', { autoClose: 3000 })
              setIsDuplicatedId(true)

              return
            }

            if (newValue == '') {
              setIsDuplicatedId(true)

              return
            }
            if (isDuplicateId) {
              setIsDuplicatedId(false)
            }

            updateId(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              newValue
            )
          }}
        />
      </section>

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='flex gap-1'>
          <BaseFontSize placeholder={result.config.style.fontSize} value={result.config.style.fontSize} />
          <BaseColorPicker label={dictionary?.color} defaultColor={result.config.style.color} />
        </div>
        <div>
          <FormatText item={result.config.style} />
        </div>
        <div>
          <FormatTextPosition item={result.config.style} />
        </div>
      </section>

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <Typography variant='h6'>{dictionary?.manageText} </Typography>
        <RadioGroup
          row
          value={result?.config?.details?.value?.valueType || 'string'}
          name='basic-radio'
          aria-label='basic-radio'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                value: {
                  value: '',
                  valueType: e.target.value
                }
              }
            )
          }
        >
          <FormControlLabel value='string' control={<Radio />} label='String' />
          <FormControlLabel value='variable' control={<Radio />} label='Variable' />
        </RadioGroup>
        {result?.config?.details?.value?.valueType == 'variable' ? (
          <Autocomplete
            fullWidth
            options={variableData?.result?.data || []}
            getOptionLabel={option => `{{${option.name}}}`}
            value={
              variableData?.result?.data?.find(
                item => item.value?.value === result?.config?.details?.value?.value?.value
              ) || null
            }
            onChange={(event, newValue) => {
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  value: {
                    ...result?.config?.details?.value,
                    ...newValue
                  }
                }
              )
            }}
            renderInput={params => <CustomTextField {...params} label='ตัวแปร' placeholder='เลือก...' />}
          />
        ) : (
          <DebouncedInput
            label={dictionary?.text}
            placeholder={result?.config?.details?.placeholder?.value}
            value={result?.config?.details?.value?.value || ''}
            onChange={newText =>
              // updateDetails(
              //   String(selectedField?.parentKey ?? ''),
              //   selectedField?.boxId ?? '',
              //   selectedField?.fieldId?.id ?? '',
              //   {
              //     value: newText
              //   }
              // )
              updateValueOnly(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                newText
              )
            }
          />
        )}

        <FormControlLabel
          control={<Switch checked={result?.config?.details?.tag?.isShow} />}
          label={dictionary?.label}
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
          label={dictionary?.displayedText}
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
          label={dictionary?.sampleText}
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
          label={dictionary?.displayedText}
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
          label={dictionary?.helpText}
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
          label={dictionary?.displayedText}
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
        <Typography>{dictionary?.rendering} </Typography>
        <FormControlLabel
          control={<Switch checked={result?.config?.details?.isRequired} />}
          label={dictionary?.required}
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
              label={dictionary?.limit}
            />
          </div>
          <CustomTextField
            label={dictionary?.characterCount}
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
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5 hidden'>
        <div>
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={result?.config?.details?.trigger?.isTrigger}
                  onChange={() =>
                    showDialog({
                      id: 'alertDialogConfirmToggleTrigger',
                      component: (
                        <ConfirmAlert
                          id='alertDialogConfirmToggleTrigger'
                          title={dictionary?.changeTriggerEventStatus}
                          content1={dictionary?.confirmToggleTriggerEvent}
                          onClick={() => {
                            updateDetails(
                              String(selectedField?.parentKey ?? ''),
                              selectedField?.boxId ?? '',
                              selectedField?.fieldId?.id ?? '',
                              {
                                trigger: {
                                  // ...result?.config?.details?.trigger,
                                  isTrigger: !result?.config?.details?.trigger?.isTrigger
                                }
                              }
                            )
                          }}
                        />
                      ),
                      size: 'sm'
                    })
                  }
                />
              }
              label='Trigger Event'
            />
          </div>
          {result?.config?.details?.trigger?.isTrigger && (
            <Button
              variant='contained'
              fullWidth
              onClick={() => {
                showDialog({
                  id: 'TriggerEventDialog',
                  component: <TriggerEventDialog id={'TriggerEventDialog'} />,
                  size: 'xl'
                })
              }}
            >
              {dictionary?.configureTriggerEvent}
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}

export default TextfieldProperty

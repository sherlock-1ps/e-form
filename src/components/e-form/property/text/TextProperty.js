/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState, useEffect, useMemo } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'

import { Title, Delete } from '@mui/icons-material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import BaseDropdown from '@components/e-form/property/BaseDropdown'
import BaseColorPicker from '@components/e-form/property/BaseColorPicker'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import BaseFontSize from '@components/e-form/property/BaseFontSize'
import { useFormStore } from '@/store/useFormStore.ts'
import { useDialog } from '@/hooks/useDialog'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'
const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 550, maxLength, ...props }) => {
  const { dictionary } = useDictionary()
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

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

const TextProperty = ({ item }) => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateId = useFormStore(state => state.updateId)
  const [isDuplicateId, setIsDuplicatedId] = useState(false)
  // const [isDuplicateId, setIsDuplicatedId] = useState(false)
  const { data: variableData } = useFetchVariableQueryOption(1, 999)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)

  const allIds = useMemo(() => {
    return form.form_details.flatMap(section => section.fields.flatMap(field => field.data.map(item => item.id)))
  }, [form])

  useEffect(() => {
    if (isDuplicateId) {
      setIsDuplicatedId(false)
    }
  }, [selectedField])

  // console.log(555)

  return (
    <div>
      <BaseTitleProperty title='ข้อความ' icon={<Title sx={{ width: '32px', height: '32px' }} />} item={selectedField} />
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
                  updateDetails(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', result?.id ?? '', {
                    isUse: !result?.config?.details?.isUse
                  })
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
                  updateDetails(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', {
                    isShow: !result?.config?.details?.isShow
                  })
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
            placeholder={result?.config?.details?.placeholder || ''}
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

        <div className='flex gap-1'>
          <BaseFontSize
            placeholder={result?.config?.style?.fontSize || ''}
            value={result?.config?.style?.fontSize}
            id={item?.id}
          />
          <BaseColorPicker label={dictionary?.color} defaultColor={result?.config?.style?.color} id={item?.id} />
        </div>
        <div>
          <FormatText item={result?.config?.style} id={item?.id} />
        </div>
        <div>
          <FormatTextPosition item={result?.config?.style} id={item?.id} />
        </div>
      </section>
      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5 hidden'>
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

        {/* <div>
          <div className='flex items-center gap-2'>
            <BaseButton text='เปลี่ยนแปลง' sx={{ display: 'flex', flex: 1 }} />
            <BaseButton text='ลบ' icon={Delete} iconPosition='right' color='error' sx={{ display: 'flex', flex: 1 }} />
          </div>
        </div> */}
      </section>
    </div>
  )
}

export default TextProperty

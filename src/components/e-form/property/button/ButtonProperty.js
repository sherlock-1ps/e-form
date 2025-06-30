'use client'
import { useState, useEffect, useMemo } from 'react'

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
import Autocomplete from '@mui/material/Autocomplete'
import RadioGroup from '@mui/material/RadioGroup'
import FormatText from '@components/e-form/property/FormatText'
import FormatTextPosition from '@components/e-form/property/FormatTextPosition'
import { formSizeConfig } from '@configs/formSizeConfig'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toast } from 'react-toastify'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 750, maxLength, ...props }) => {
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

const ButtonProperty = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateStyle = useFormStore(state => state.updateStyle)
  const updateId = useFormStore(state => state.updateId)
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
    if (isDuplicateId) {
      setIsDuplicatedId(false)
    }
  }, [selectedField])

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
        <Typography>{dictionary?.displaySize} </Typography>
        <div className='flex gap-2'>
          <CustomTextField
            type='number'
            label={dictionary?.width}
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
            label={dictionary?.height}
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
        <CustomTextField select fullWidth defaultValue={10} label={dictionary?.buttonType} id='select-position'>
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>ข้อความ</MenuItem>
          <MenuItem value={20}>ตัวเลข</MenuItem>
        </CustomTextField>
        <div className='p-2 bg-primaryLighter rounded-md'>
          <Typography variant='body2'>{dictionary?.buttonText} </Typography>
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
              placeholder={result?.config?.details?.placeholder}
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
                          title='เปลี่ยนสถานะ Trigger Event?'
                          content1='คุณต้องการเปิดหรือปิด Trigger Event ใช่หรือไม่'
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
              ตั้งค่า Trigger Event
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}

export default ButtonProperty

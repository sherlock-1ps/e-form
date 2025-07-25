/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState, useEffect, useMemo } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, Button, Grid, IconButton } from '@mui/material'
import { ArrowDropDownCircleOutlined, DeleteOutlined, Add } from '@mui/icons-material'

import Switch from '@mui/material/Switch'

import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import ChoiceBox from '@/components/e-form/property/select/ChoiceBox'
import { useFormStore } from '@/store/useFormStore.ts'
import { useDialog } from '@/hooks/useDialog'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import { toast } from 'react-toastify'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import AddOptionDropdownDialog from '@/components/dialogs/form/AddOptionDropdownDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { toolboxOptionMenu } from '@/data/toolbox/toolboxMenu'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Autocomplete from '@mui/material/Autocomplete'
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

const DropdownProperty = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()

  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateId = useFormStore(state => state.updateId)
  const [isDuplicateId, setIsDuplicatedId] = useState(false)
  const { data: variableData } = useFetchVariableQueryOption(1, 999)

  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)
  const options =
    result?.config?.details?.value?.value?.options ?? result?.config?.details?.value?.value?.value?.value?.options

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
        title='ตัวเลือก: รายการ'
        icon={<ArrowDropDownCircleOutlined sx={{ width: '24px', height: '24px' }} />}
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
        <RadioGroup
          row
          value={result?.config?.details?.keyValue?.keyValueType || 'string'}
          name='basic-radio'
          aria-label='basic-radio'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                keyValue: {
                  value: '',
                  keyValueType: e.target.value
                }
              }
            )
          }
        >
          <FormControlLabel value='string' control={<Radio />} label='String' />
          <FormControlLabel value='variable' control={<Radio />} label='Variable' />
        </RadioGroup>
        {result?.config?.details?.keyValue?.keyValueType == 'variable' ? (
          <Autocomplete
            fullWidth
            options={
              variableData?.result?.data?.filter(
                item => item.variable_type == 'string' || item.variable_type == 'number'
              ) || []
            }
            getOptionLabel={option => `{{${option.name}}}`}
            value={
              variableData?.result?.data?.find(
                item => item.value?.value === result?.config?.details?.keyValue?.value?.value?.value
              ) || null
            }
            onChange={(event, newValue) => {
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  keyValue: {
                    ...result?.config?.details?.keyValue,
                    value: newValue,
                    realValue: newValue?.value?.value
                  }
                }
              )
            }}
            renderInput={params => <CustomTextField {...params} label='ตัวแปร' placeholder='เลือก...' />}
          />
        ) : (
          <DebouncedInput
            label={dictionary?.configure}
            placeholder={dictionary?.enterText}
            value={result?.config?.details?.keyValue?.realValue || ''}
            onChange={
              newText =>
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    keyValue: {
                      ...result?.config?.details?.keyValue,
                      realValue: newText
                    }
                  }
                )
              // updateValueOnly(
              //   String(selectedField?.parentKey ?? ''),
              //   selectedField?.boxId ?? '',
              //   selectedField?.fieldId?.id ?? '',
              //   newText
              // )
            }
          />
        )}
      </section>

      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
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
          value={result?.config?.details?.placeholder?.name}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                placeholder: {
                  ...result?.config?.details?.placeholder,
                  name: e.target.value
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
        <Typography>{dictionary?.dataValidation} </Typography>
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
        <CustomTextField
          label={dictionary?.linkField}
          placeholder='Other Component ID'
          value={result?.config?.details?.linkField ?? ''}
          // maxLength={1}
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                ...result?.config?.details,
                linkField: e.target.value
              }
            )
          }
        />
      </section>
      <section
        className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
        style={{ borderBottom: '1.5px solid #11151A1F' }}
      >
        <div className='flex items-center justify-between'>
          <Typography variant='h6'>{dictionary?.displayOptions} </Typography>
          {(result?.config?.details?.value?.value?.defaultValue ||
            result?.config?.details?.value?.value?.value?.value?.defaultValue) && (
            <IconButton
              className=' bg-slate-200'
              onClick={() => {
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    value: {
                      ...toolboxOptionMenu[3]?.config?.details?.value
                    }
                  }
                )
              }}
            >
              <DeleteOutlined style={{ color: 'red', fontSize: '20px' }} />
            </IconButton>
          )}
        </div>

        {/* <ChoiceBox item={result} /> */}
        {result?.config?.details?.value?.value?.defaultValue ||
          (result?.config?.details?.value?.value?.value?.value?.defaultValue && (
            <CustomTextField
              fullWidth
              label='Default Value'
              value={
                result?.config?.details?.value?.value?.defaultValue ||
                result?.config?.details?.value?.value?.value?.value?.defaultValue
              }
              disabled
            />
          ))}
        {options?.length > 0 ? (
          options.map((item, index) => (
            <div className='flex flex-col mt-2' key={index}>
              <Typography>ตัวเลือกที่ {index + 1}</Typography>
              <div className='flex gap-2 p-1 items-end'>
                <CustomTextField fullWidth label='Name' value={item?.name} disabled />
                <CustomTextField fullWidth label='Value' value={item?.value} disabled />
              </div>
            </div>
          ))
        ) : (
          <Typography variant='body2' className='my-2'>
            {dictionary?.noOptionsAvailable}
          </Typography>
        )}

        <BaseButton
          text={`${result?.config?.details?.value?.value?.defaultValue ? dictionary?.changeOption : dictionary?.addOption}`}
          icon={Add}
          iconPosition='left'
          color='secondary'
          onClick={() => {
            showDialog({
              id: 'AddOptionDropdownDialog',
              component: <AddOptionDropdownDialog id={'AddOptionDropdownDialog'} data={result} />,
              size: 'md'
            })
          }}
        />
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
      </section>
    </div>
  )
}

export default DropdownProperty

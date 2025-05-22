/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState, useMemo, useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox'

import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography, MenuItem, Card, Box, IconButton, RadioGroup, Radio, Button } from '@mui/material'
import { ToggleOnOutlined, Delete, CancelOutlined, CheckCircleOutline } from '@mui/icons-material'
import Switch from '@mui/material/Switch'
import { useDispatch } from 'react-redux'
import Autocomplete from '@mui/material/Autocomplete'
import BaseTitleProperty from '@components/e-form/property/BaseTitleProperty'
import CustomTextField from '@core/components/mui/TextField'
import BaseButton from '@/components/ui/button/BaseButton'
import ChoiceBox from '@/components/e-form/property/select/ChoiceBox'
import { useFormStore } from '@/store/useFormStore.ts'
import TriggerEventDialog from '@/components/dialogs/form/TriggerEventDialog'
import { toast } from 'react-toastify'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import AddOptionDropdownDialog from '@/components/dialogs/form/AddOptionDropdownDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useDialog } from '@/hooks/useDialog'
import { toolboxOptionMenu } from '@/data/toolbox/toolboxMenu'

const DebouncedInput = ({ value: initialValue, onChange, isEng = false, debounce = 550, maxLength, ...props }) => {
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

const SwitchProperty = () => {
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

  const allIds = useMemo(() => {
    return form.form_details.flatMap(section => section.fields.flatMap(field => field.data.map(item => item.id)))
  }, [form])

  useEffect(() => {
    if (isDuplicateId) {
      setIsDuplicatedId(false)
    }
  }, [selectedField])

  const handleChange = event => {
    const value = event.target.value === 'true' // convert back to boolean

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        value: {
          ...result?.config?.details?.value,
          value: value
        }
      }
    )
  }

  return (
    <div>
      <BaseTitleProperty
        title='สวิตซ์'
        icon={<ToggleOnOutlined sx={{ width: '24px', height: '24px' }} />}
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
          value={result?.config?.details?.value?.valueType || 'custom'}
          name='basic-radio'
          aria-label='basic-radio'
          onChange={e =>
            updateDetails(
              String(selectedField?.parentKey ?? ''),
              selectedField?.boxId ?? '',
              selectedField?.fieldId?.id ?? '',
              {
                value: {
                  ...toolboxOptionMenu[3]?.config?.details?.value,
                  valueType: e.target.value
                }
              }
            )
          }
        >
          <FormControlLabel value='custom' control={<Radio />} label='Custom' />
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
            label='ข้อความ'
            placeholder={'กรอกข้อความ'}
            value={result?.config?.details?.value?.name || ''}
            onChange={newText =>
              updateDetails(
                String(selectedField?.parentKey ?? ''),
                selectedField?.boxId ?? '',
                selectedField?.fieldId?.id ?? '',
                {
                  value: {
                    ...result?.config?.details?.value,
                    name: newText
                  }
                }
              )
            }
          />
        )}
        {/* <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid var(--mui-palette-primary-main)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant='body1' color={'text.primary'}>
                ข้อความ
              </Typography>
            </Box>
          </Box>

          <RadioGroup row defaultValue='checked' name='basic-radio' aria-label='basic-radio'>
            <FormControlLabel value='checked' control={<Radio />} label='String' />
            <FormControlLabel value='unchecked' control={<Radio />} label='AppState' />
            <FormControlLabel value='test' control={<Radio />} label='API' />
          </RadioGroup>

          <Box>
            <Typography variant='body2' sx={{ marginBottom: 1 }}>
              รายละเอียด
            </Typography>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='Placeholder'
              value={result?.config?.details?.text ?? ''}
              onChange={e =>
                updateDetails(
                  String(selectedField?.parentKey ?? ''),
                  selectedField?.boxId ?? '',
                  selectedField?.fieldId?.id ?? '',
                  {
                    text: e.target.value
                  }
                )
              }
            />
          </Box>
        </Card> */}
      </section>

      {result?.config?.details?.value?.valueType == 'custom' && (
        <section
          className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'
          style={{ borderBottom: '1.5px solid #11151A1F' }}
        >
          <Typography variant='body2'>ค่าเริ่มต้น</Typography>
          <RadioGroup
            row
            value={result?.config?.details?.value?.value}
            name='basic-radio'
            aria-label='basic-radio'
            onChange={handleChange}
          >
            <FormControlLabel value={false} control={<Radio />} label='ปิด' />
            <FormControlLabel value={true} control={<Radio />} label='เปิด' />
          </RadioGroup>
        </section>
      )}

      <section className='flex-1 flex flex-col my-4 mx-6 gap-2 pb-3.5'>
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
      </section>
    </div>
  )
}

export default SwitchProperty

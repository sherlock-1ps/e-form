/* eslint-disable react-hooks/exhaustive-deps */
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomTextField from '@/@core/components/mui/TextField'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import { useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import ConfirmAlert from '../alerts/ConfirmAlert'
import SelectTriggerTypeDialog from './SelectTriggerTypeDialog'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import Autocomplete from '@mui/material/Autocomplete'
import { useFormStore } from '@/store/useFormStore'
import { toast } from 'react-toastify'

interface TriggerProps {
  id: string
}

const events = [
  { id: 1, name: 'onBlur', key: 'blur' },
  { id: 2, name: 'onChange', key: 'change' },
  { id: 3, name: 'onFocus', key: 'focus' },
  { id: 4, name: 'onSelect', key: 'select' },
  { id: 5, name: 'onKeyPress', key: 'keypress' },
  { id: 6, name: 'onClick', key: 'click' },
  { id: 7, name: 'onLoad', key: 'load' }
]

const actions = [
  { id: 1, name: 'Set Value', key: 'setValue' },
  { id: 2, name: 'Call API', key: 'callApi' }
]

const allowedEventsMap: Record<string, string[]> = {
  text: ['load'],
  button: ['click', 'focus'],
  input: ['blur', 'change', 'focus', 'select'],
  default: ['blur', 'change', 'focus', 'select', 'keypress', 'click', 'load']
}

const operatorList = [
  {
    id: 1,
    name: '==',
    key: '=='
  },
  {
    id: 2,
    name: '!=',
    key: '!='
  },
  {
    id: 3,
    name: '>',
    key: '>'
  },
  {
    id: 4,
    name: '<',
    key: '<'
  },
  {
    id: 5,
    name: '>=',
    key: '>='
  },
  {
    id: 6,
    name: '<=',
    key: '<='
  }
]

const getAllIdsFromData = (form: any) => {
  const ids: string[] = []
  form.form_details.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      field.data.forEach((item: any) => {
        if (item.id) {
          ids.push(item.id)
        }
      })
    })
  })

  return ids
}

const TriggerEventDialog = ({ id }: TriggerProps) => {
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)
  const allowedKeys = allowedEventsMap[result?.config?.details?.type] || allowedEventsMap.default
  const { closeDialog } = useDialog()
  const { showDialog } = useDialog()
  const [conditions, setConditions] = useState<any>(result?.config?.details?.trigger?.conditions || [])
  const [selectedTriggerEvent, setSelectedTriggerEvent] = useState<string>(
    result?.config?.details?.trigger?.event || ''
  )
  const [selectedTriggerAction, setSelectedTriggerAction] = useState<string>(
    result?.config?.details?.trigger?.action?.type || ''
  )
  const [valueAction, setValueAction] = useState({
    typeFrom: result?.config?.details?.trigger?.action?.from?.type || 'current',
    valueFrom: result?.config?.details?.trigger?.action?.from?.value || '',
    typeTo: result?.config?.details?.trigger?.action?.to?.type || 'variable',
    valueTo: result?.config?.details?.trigger?.action?.to?.value || ''
  })
  const { data: variableData } = useFetchVariableQueryOption(1, 350)
  const ids = useMemo(() => getAllIdsFromData(form), [])

  console.log('conditions', conditions)

  const addCondition = (key1: any, key2: any) => {
    const variable1 = {
      type: key1,
      value: '',
      id: ''
    }
    const variable2 = {
      type: key2,
      value: '',
      id: ''
    }
    setConditions((prev: any) => [...prev, { id: nanoid(8), logic: 'and', variable1, variable2, operator: null }])
  }

  const removeCondition = (id: string) => {
    setConditions((prev: any) => prev.filter((condition: any) => condition.id !== id))
  }
  console.log('result', result)

  const renderValueFrom = () => {
    switch (valueAction.typeFrom) {
      case 'current':
        return <CustomTextField fullWidth value={`{form:${result?.id}}`} label='รายละเอียด' disabled />

      case 'string':
        return (
          <CustomTextField
            fullWidth
            value={valueAction.valueFrom}
            label='รายละเอียด'
            placeholder='ระบุข้อมูล'
            onChange={e => setValueAction(prev => ({ ...prev, valueFrom: e.target.value }))}
          />
        )

      case 'variable':
        return (
          <Autocomplete
            fullWidth
            options={variableData?.result?.data || []}
            getOptionLabel={option => `{{${option.name}}}`}
            value={variableData?.result?.data?.find((item: any) => item.value?.value === valueAction.valueFrom) || null}
            onChange={(event, newValue) => {
              setValueAction(prev => ({ ...prev, valueFrom: newValue?.value?.value ?? '' }))
            }}
            renderInput={params => <CustomTextField {...params} label='รายละเอียด' placeholder='เลือก...' />}
          />
        )

      case 'field':
        return (
          <Autocomplete
            fullWidth
            options={ids.map(id => ({ name: id, value: id }))}
            getOptionLabel={option => `{form:${option.name}}`}
            value={ids.map(id => ({ name: id, value: id })).find(item => item.value === valueAction.valueFrom) || null}
            onChange={(event, newValue) => {
              setValueAction(prev => ({ ...prev, valueFrom: newValue?.value ?? '' }))
            }}
            renderInput={params => <CustomTextField {...params} label='รายละเอียด' placeholder='เลือก...' />}
          />
        )

      default:
        return null
    }
  }

  const renderValueTo = () => {
    switch (valueAction.typeTo) {
      case 'variable':
        return (
          <Autocomplete
            fullWidth
            options={variableData?.result?.data || []}
            getOptionLabel={option => `{{${option.name}}}`}
            value={variableData?.result?.data?.find((item: any) => item.value?.value === valueAction.valueTo) || null}
            onChange={(event, newValue) => {
              setValueAction(prev => ({ ...prev, valueTo: newValue?.value?.value ?? '' }))
            }}
            renderInput={params => <CustomTextField {...params} label='รายละเอียด' placeholder='เลือก...' />}
          />
        )

      case 'field':
        return (
          <Autocomplete
            fullWidth
            options={ids.map(id => ({ name: id, value: id }))}
            getOptionLabel={option => `{form:${option.name}}`}
            value={ids.map(id => ({ name: id, value: id })).find(item => item.value === valueAction.valueTo) || null}
            onChange={(event, newValue) => {
              setValueAction(prev => ({ ...prev, valueTo: newValue?.value ?? '' }))
            }}
            renderInput={params => <CustomTextField {...params} label='รายละเอียด' placeholder='เลือก...' />}
          />
        )

      default:
        return null
    }
  }

  const handleClickSubmit = () => {
    if (!selectedTriggerEvent || !selectedTriggerAction) {
      toast.error('กรุณาเลือก event และ action', { autoClose: 3000 })
      return
    }

    if (selectedTriggerAction === 'setValue' && valueAction.valueFrom === valueAction.valueTo) {
      toast.error('value จากค่า1 ไปยังค่า 2 ห้ามมีค่าเท่ากัน', { autoClose: 3000 })
      return
    }

    const isIncompleteCondition = conditions.some(
      (condition: any) =>
        !condition.operator ||
        condition.variable1?.value === undefined ||
        condition.variable1?.value === '' ||
        condition.variable2?.value === undefined ||
        condition.variable2?.value === ''
    )

    if (isIncompleteCondition) {
      toast.error('กรุณากรอก condition ให้ครบถ้วน', { autoClose: 3000 })
      return
    }

    const resultData = {
      event: selectedTriggerEvent,
      conditions,
      action: {
        type: selectedTriggerAction,
        from: {
          type: valueAction?.typeFrom,
          value: valueAction?.valueFrom
        },
        to: {
          type: valueAction?.typeTo,
          value: valueAction?.valueTo
        }
      }
    }

    const existingTrigger = result?.config?.details?.trigger ?? {}

    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        trigger: {
          ...existingTrigger,
          ...resultData
        }
      }
    )

    closeDialog(id)
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>ตั้งค่า Trigger Event</Typography>
      </Grid>

      <Grid item xs={12}>
        <div className='flex gap-4 w-full'>
          <div className='w-1/2'>
            <CustomTextField
              select
              fullWidth
              label='Trigger Event'
              value={selectedTriggerEvent}
              onChange={e => setSelectedTriggerEvent(e.target.value)}
              SelectProps={{
                displayEmpty: true
              }}
            >
              <MenuItem value='' disabled>
                <em className='opacity-50'>ว่าง</em>
              </MenuItem>

              {events
                .filter(event => allowedKeys.includes(event.key))
                .map(event => (
                  <MenuItem key={event.id} value={event.key}>
                    {event.name}
                  </MenuItem>
                ))}
            </CustomTextField>
            {selectedTriggerEvent && (
              <div>
                <Divider className='my-3' />
                <div className='flex items-center gap-4'>
                  <div className='w-8 h-8 bg-gray-500 text-white text-xs font-bold rounded-[4px] rotate-45 flex items-center justify-center'>
                    <div className='-rotate-45'>If</div>
                  </div>
                  <Typography variant='body2'>*ใส่เงื่อนไขของ trigger event</Typography>
                </div>
                {conditions.map((condition: any, index: any) => {
                  return (
                    <div key={condition.id} className='flex items-end gap-2 mt-4'>
                      {index !== 0 && (
                        <FormControl component='fieldset'>
                          <RadioGroup
                            row
                            value={condition.logic}
                            onChange={e => {
                              const updated = [...conditions]
                              updated[index].logic = e.target.value as 'and' | 'or'
                              setConditions(updated)
                            }}
                          >
                            <FormControlLabel value='and' control={<Radio />} label='AND' />
                            <FormControlLabel value='or' control={<Radio />} label='OR' />
                          </RadioGroup>
                        </FormControl>
                      )}
                      <div className='flex flex-col gap-1 w-1/3'>
                        {condition?.variable1?.type === 'variable' || condition?.variable1?.type === 'field' ? (
                          <Autocomplete
                            fullWidth
                            options={
                              condition?.variable1.type === 'variable'
                                ? variableData?.result?.data || []
                                : ids.map(id => ({ name: id, value: id }))
                            }
                            getOptionLabel={option => {
                              if (condition?.variable1?.type == 'field') {
                                return `{form:${option.name}}`
                              } else {
                                return `{{${option.name}}}`
                              }
                            }}
                            value={
                              condition?.variable1.type === 'variable'
                                ? variableData?.result?.data?.find(
                                    (item: any) => item.value?.value === condition?.variable1?.value
                                  ) || null
                                : ids
                                    .map(id => ({ name: id, value: id }))
                                    .find(item => item.value === condition?.variable1?.value) || null
                            }
                            onChange={(event, newValue) => {
                              const updatedConditions = [...conditions]
                              if (condition?.variable1?.type === 'variable') {
                                updatedConditions[index].variable1.value = newValue?.value.value ?? ''
                                updatedConditions[index].variable1.id = newValue?.id ?? ''
                              } else {
                                updatedConditions[index].variable1.value = newValue?.value ?? ''
                              }
                              setConditions(updatedConditions)
                            }}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                label={`ตัวแปร 1 : ${condition?.variable1.type}`}
                                placeholder='เลือก...'
                              />
                            )}
                          />
                        ) : (
                          <CustomTextField
                            fullWidth
                            placeholder='เลือก...'
                            variant='outlined'
                            size='small'
                            label={`ตัวแปร 1 : ${condition?.variable1.type}`}
                            value={condition?.variable1.value || ''}
                            onChange={e => {
                              const updated = [...conditions]
                              updated[index].variable1.value = e.target.value
                              setConditions(updated)
                            }}
                          />
                        )}
                      </div>

                      <div className='flex flex-col gap-1 w-1/3'>
                        <CustomTextField
                          select
                          fullWidth
                          label='Operator'
                          value={condition.operator || ''}
                          onChange={e => {
                            const updated = [...conditions]
                            updated[index].operator = e.target.value
                            setConditions(updated)
                          }}
                          SelectProps={{
                            displayEmpty: true
                          }}
                        >
                          <MenuItem value='' disabled>
                            <em className='opacity-50'>ว่าง</em>
                          </MenuItem>
                          {operatorList.map(operator => (
                            <MenuItem key={operator.id} value={operator.key}>
                              {operator.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </div>

                      <div className='flex flex-col gap-1 w-1/3'>
                        {condition?.variable2?.type === 'variable' || condition?.variable2?.type === 'field' ? (
                          <Autocomplete
                            fullWidth
                            options={
                              condition?.variable2.type === 'variable'
                                ? variableData?.result?.data || []
                                : ids.map(id => ({ name: id, value: id }))
                            }
                            getOptionLabel={option => {
                              if (condition?.variable2?.type == 'field') {
                                return `{form:${option.name}}`
                              } else {
                                return `{{${option.name}}}`
                              }
                            }}
                            value={
                              condition?.variable2.type === 'variable'
                                ? variableData?.result?.data?.find(
                                    (item: any) => item.value?.value === condition?.variable2?.value
                                  ) || null
                                : ids
                                    .map(id => ({ name: id, value: id }))
                                    .find(item => item.value === condition?.variable2?.value) || null
                            }
                            onChange={(event, newValue) => {
                              const updatedConditions = [...conditions]
                              if (condition?.variable2?.type === 'variable') {
                                updatedConditions[index].variable2.value = newValue?.value.value ?? ''
                                updatedConditions[index].variable2.id = newValue?.id ?? ''
                              } else {
                                updatedConditions[index].variable2.value = newValue?.value ?? ''
                              }
                              setConditions(updatedConditions)
                            }}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                label={`ตัวแปร 2 : ${condition?.variable2.type}`}
                                placeholder='เลือก...'
                              />
                            )}
                          />
                        ) : (
                          <CustomTextField
                            fullWidth
                            placeholder='เลือก...'
                            variant='outlined'
                            size='small'
                            label={`ตัวแปร 2 : ${condition?.variable2.type}`}
                            value={condition?.variable2.value || ''}
                            onChange={e => {
                              const updated = [...conditions]
                              updated[index].variable2.value = e.target.value
                              setConditions(updated)
                            }}
                          />
                        )}
                      </div>
                      <IconButton color='error' aria-label='delete' onClick={() => removeCondition(condition.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )
                })}
                <div className='flex flex-col items-start gap-4 mt-4'>
                  <Button
                    variant='contained'
                    startIcon={<AddIcon fontSize='small' />}
                    //  onClick={addCondition}
                    onClick={() => {
                      showDialog({
                        id: 'alertSelectTriggerTypeDialog',
                        component: <SelectTriggerTypeDialog id='alertSelectTriggerTypeDialog' onAdd={addCondition} />,
                        size: 'sm'
                      })
                    }}
                  >
                    เพิ่มเงื่อนไข
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Divider orientation='vertical' flexItem className='  bg-slate-200 w-[2px]' />

          <div className='w-1/2'>
            <CustomTextField
              select
              fullWidth
              label='Trigger Action'
              value={selectedTriggerAction}
              onChange={e => setSelectedTriggerAction(e.target.value)}
              SelectProps={{
                displayEmpty: true
              }}
            >
              <MenuItem value='' disabled>
                <em className='opacity-50'>ว่าง</em>
              </MenuItem>

              {actions.map(action => (
                <MenuItem key={action.id} value={action.key}>
                  {action.name}
                </MenuItem>
              ))}
            </CustomTextField>

            {selectedTriggerAction == 'setValue' && (
              <div>
                <Divider className='my-3' />
                <Typography variant='body2'>ส่งจากค่า</Typography>
                <RadioGroup
                  row
                  value={valueAction.typeFrom}
                  onChange={e =>
                    setValueAction(prev => ({
                      ...prev,
                      typeFrom: e.target.value,
                      valueFrom: ''
                    }))
                  }
                  name='value-from-radio'
                  aria-label='value-from-radio'
                >
                  <FormControlLabel value='current' control={<Radio />} label='Current Field' />
                  <FormControlLabel value='string' control={<Radio />} label='String' />
                  <FormControlLabel value='variable' control={<Radio />} label='Variable' />
                  <FormControlLabel value='field' control={<Radio />} label='Form' />
                </RadioGroup>

                {renderValueFrom()}

                <Typography variant='body2' className='mt-2'>
                  ไปยัง
                </Typography>

                <RadioGroup
                  row
                  value={valueAction.typeTo}
                  onChange={e =>
                    setValueAction(prev => ({
                      ...prev,
                      typeTo: e.target.value,
                      valueTo: ''
                    }))
                  }
                  name='value-from-radio'
                  aria-label='value-from-radio'
                >
                  <FormControlLabel value='variable' control={<Radio />} label='Variable' />
                  <FormControlLabel value='field' control={<Radio />} label='Form' />
                </RadioGroup>

                {renderValueTo()}
              </div>
            )}
          </div>
        </div>
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          // onClick={() => {
          //   closeDialog(id), onClick()

          // }}
          onClick={handleClickSubmit}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default TriggerEventDialog

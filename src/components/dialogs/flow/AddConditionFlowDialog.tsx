'use client'

import { useState, useEffect } from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import { Info } from '@mui/icons-material'
import { nanoid } from 'nanoid'
import DeleteIcon from '@mui/icons-material/Delete'

import AddIcon from '@mui/icons-material/Add'

import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import SelectTriggerTypeDialog from '../form/SelectTriggerTypeDialog'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'

interface AddConditionFlowDialogProps {
  id: string
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

const AddConditionFlowDialog = ({ id }: AddConditionFlowDialogProps) => {
  const { closeDialog } = useDialog()
  const { showDialog } = useDialog()
  const [conditions, setConditions] = useState<any>([])
  const { data: variableData } = useFetchVariableQueryOption(1, 999)

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

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          จัดการเงื่อนไข
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <div className='flex items-center gap-4'>
          <div className='w-8 h-8 bg-gray-500 text-white text-xs font-bold rounded-[4px] rotate-45 flex items-center justify-center'>
            <div className='-rotate-45'>If</div>
          </div>
          <Typography variant='body2'>*ใส่เงื่อนไขของโฟลว์</Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
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
                    options={condition?.variable1.type === 'variable' ? variableData?.result?.data || [] : []}
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
                        : []
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
                    options={condition?.variable2.type === 'variable' ? variableData?.result?.data || [] : []}
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
                        : []
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
      </Grid>

      <Grid item xs={12}>
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
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddConditionFlowDialog

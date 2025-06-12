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
  Typography,
  Box,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Select
} from '@mui/material'
import SelectTriggerTypeDialog from '../form/SelectTriggerTypeDialog'
import { useFetchVariableQueryOption, useFetchGetFormFieldsQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useFlowStore } from '@/store/useFlowStore'
import { Add, Delete } from '@mui/icons-material'
interface AddConditionFlowDialogProps {
  id: string
}

type Condition = {
  source1: 'manual' | 'data'
  value1: string
  operator: string
  source3: 'manual' | 'data'
  value3: string
}

const operatorOptions = ['=', '!=', '>', '<', '>=', '<=']

const AddConditionFlowDialog = ({ id }: AddConditionFlowDialogProps) => {
  const [conditions, setConditions] = useState<Condition[]>([
    { source1: 'manual', value1: '', operator: '=', source3: 'manual', value3: '' }
  ])
  const [logicOperator, setLogicOperator] = useState<'AND' | 'OR'>('AND')

  const handleChange = <K extends keyof Condition>(index: number, field: K, value: Condition[K]) => {
    const updated = [...conditions]
    updated[index][field] = value
    setConditions(updated)
  }

  const addCondition = () => {
    setConditions([...conditions, { source1: 'manual', value1: '', operator: '=', source3: 'manual', value3: '' }])
  }

  const removeCondition = (index: number) => {
    const updated = [...conditions]
    updated.splice(index, 1)
    setConditions(updated)
  }

  const getAllValues = () => {
    console.log('Current Conditions:', { conditions, logicOperator })
  }

  const setAllValues = () => {
    const preset: Condition[] = [
      {
        source1: 'data',
        value1: 'r7mqnTRW',
        operator: '=',
        source3: 'data',
        value3: 'PKrZ2sJ3'
      },
      {
        source1: 'data',
        value1: 'khsH3SmJ',
        operator: '=',
        source3: 'manual',
        value3: '50'
      }
    ]
    setConditions(preset)
  }

  const [linkName, setLinkName] = useState<string>('เงื่อนไขเส้นทางที่ 1')

  const { closeDialog } = useDialog()
  const { showDialog } = useDialog()

  // const { data: variableData } = useFetchVariableQueryOption(1, 999)

  // const { data: formFields } = useFetchGetFormFieldsQueryOption()
  const myDiagram = useFlowStore(state => state.myDiagram)
  const selectedField = useFlowStore(state => state.selectedField)
  const nodeData = myDiagram.model.findNodeDataForKey(selectedField?.data?.key)
  const { data: formFieldList } = useFetchGetFormFieldsQueryOption(nodeData.form)

  function addLinkToCurrentNode() {
    if (selectedField) {
      const newLink = Date.now() // Create a unique ID for the new link

      const model = myDiagram.model
      const location = selectedField.data.location.split(' ')

      let linkCount = 0
      selectedField.linksConnected.map((a: any) => {
        if (a.data.from == selectedField.key) {
          linkCount++
        }
      })

      location[1] = String(parseInt(location[1]) + 180)

      if (linkCount > 0) {
        if (linkCount % 2 == 0) {
          location[0] = String(parseInt(location[0]) + Math.ceil(linkCount / 2) * 150)
        } else {
          location[0] = String(parseInt(location[0]) - Math.ceil(linkCount / 2) * 150)
        }
      }
      const newPart = {
        key: Date.now() + Math.floor(Math.random() * 1000),
        text: 'Activity',
        figure: 'Rectangle',
        category: 'activity',
        // components: JSON.stringify(['1', '2']),
        location: location.join(' ')
      }
      model.addNodeData(newPart)

      const newLinkData = {
        key: newLink,
        toPort: 'T',
        fromPort: 'B',
        from: selectedField.data.key,
        to: newPart.key,
        text: linkName,
        rule: { conditions, logicOperator, form: nodeData.form }
      }
      // Add the new link to the diagram's model
      // pushLinkData(newLinkData)
      myDiagram.model.addLinkData(newLinkData)
    } else {
      console.log('No node is selected.')
    }
  }

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          จัดการเงื่อนไข
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          value={linkName}
          onChange={e => setLinkName(e.target.value)}
          placeholder='ชื่อเส้นทาง'
          fullWidth
          label='ชื่อเส้นทาง'
        />
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
        <Box sx={{ p: 2 }}>
          {conditions.map((cond, index) => (
            <Grid container spacing={2} key={index} alignItems='center' sx={{ mb: 1 }}>
              {/* Field 1 source and input */}
              <Grid item xs={2}>
                <Select
                  value={cond.source1}
                  onChange={e => handleChange(index, 'source1', e.target.value as 'data' | 'manual')}
                  fullWidth
                >
                  <MenuItem value='manual'>กำหนดเอง</MenuItem>
                  <MenuItem value='data'>ฟิวด์</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={3}>
                {cond.source1 === 'manual' ? (
                  <TextField
                    value={cond.value1}
                    onChange={e => handleChange(index, 'value1', e.target.value)}
                    fullWidth
                    label='ตัวแปรที่ 1'
                  />
                ) : (
                  <Select value={cond.value1} onChange={e => handleChange(index, 'value1', e.target.value)} fullWidth>
                    {formFieldList?.result?.data?.map(opt => (
                      <MenuItem key={'value1' + opt.id} value={opt.id}>
                        {`${opt.type}: ${opt.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Grid>

              {/* Operator */}
              <Grid item xs={2}>
                <Select value={cond.operator} onChange={e => handleChange(index, 'operator', e.target.value)} fullWidth>
                  {operatorOptions.map(op => (
                    <MenuItem key={op} value={op}>
                      {op}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Field 3 source and input */}
              <Grid item xs={2}>
                <Select
                  value={cond.source3}
                  onChange={e => handleChange(index, 'source3', e.target.value as 'data' | 'manual')}
                  fullWidth
                >
                  <MenuItem value='manual'>กำหนดเอง</MenuItem>
                  <MenuItem value='data'>ฟิวด์</MenuItem>
                </Select>
                {/* 
                <Select value={cond.source3} onChange={e => handleChange(index, 'source3', e.target.value)} fullWidth>
                  <MenuItem value='manual'>กำหนดเอง</MenuItem>
                  <MenuItem value='data'>ฟิวด์</MenuItem>
                </Select> */}
              </Grid>
              <Grid item xs={2}>
                {cond.source3 === 'manual' ? (
                  <TextField
                    value={cond.value3}
                    onChange={e => handleChange(index, 'value3', e.target.value)}
                    fullWidth
                    label='ตัวแปรที่ 2'
                  />
                ) : (
                  <Select value={cond.value3} onChange={e => handleChange(index, 'value3', e.target.value)} fullWidth>
                    {formFieldList?.result?.data?.map(opt => (
                      <MenuItem key={'value2' + opt.id} value={opt.id}>
                        {`${opt.type}: ${opt.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Grid>

              {/* Remove button */}
              <Grid item xs={1}>
                <IconButton onClick={() => removeCondition(index)} disabled={conditions.length === 1}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Add + Logical operator */}
          <Box display='flex' alignItems='center' gap={2}>
            <Button variant='contained' onClick={addCondition} startIcon={<Add />}>
              เพิ่ม
            </Button>
            {conditions.length > 1 && (
              <ToggleButtonGroup value={logicOperator} exclusive onChange={(_, val) => val && setLogicOperator(val)}>
                <ToggleButton value='AND'>AND</ToggleButton>
                <ToggleButton value='OR'>OR</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        {/* <Button variant='outlined' onClick={getAllValues}>
          Get Values
        </Button>
        <Button variant='outlined' onClick={setAllValues}>
          Set Values
        </Button> */}
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          autoFocus
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
            addLinkToCurrentNode()
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

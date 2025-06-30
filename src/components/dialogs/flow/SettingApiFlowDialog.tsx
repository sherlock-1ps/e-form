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
  Tab,
  TextField,
  Typography
} from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomTextField from '@/@core/components/mui/TextField'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import { SyntheticEvent, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import ConfirmAlert from '../alerts/ConfirmAlert'
import { useFetchApiQueryOption, useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import Autocomplete from '@mui/material/Autocomplete'
import { useFormStore } from '@/store/useFormStore'
import { toast } from 'react-toastify'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import axios, { isAxiosError } from 'axios'
import { useToolboxTabStore } from '@/store/useToolboxTabStore'
import { useDictionary } from '@/contexts/DictionaryContext'

interface TriggerProps {
  id: string
}

const events = [
  { id: 1, name: 'onBlur', key: 'onBlur' },
  { id: 2, name: 'onChange', key: 'onChange' },
  { id: 3, name: 'onFocus', key: 'onFocus' },
  { id: 4, name: 'onSelect', key: 'onSelect' },
  { id: 5, name: 'onKeyDown', key: 'onKeyDown' },
  { id: 6, name: 'onClick', key: 'onClick' },
  { id: 7, name: 'onLoad', key: 'onLoad' }
]

const actions = [
  { id: 1, name: 'Set Value', key: 'setValue' },
  { id: 2, name: 'Call API', key: 'callApi' }
]

const allowedEventsMap: Record<string, string[]> = {
  text: ['onLoad'],
  image: ['onLoad'],
  video: ['onLoad'],
  button: ['onBlur', 'onFocus', 'onKeyDown', 'onClick'],
  input: ['blur', 'change', 'onFocus', 'select'],
  default: ['blur', 'change', 'focus', 'select', 'keypress', 'onClick', 'onLoad']
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

const SettingApiFlowDialog = ({ id }: TriggerProps) => {
  const { dictionary } = useDictionary()
  const form = useFormStore(state => state.form)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)
  const { setActiveTab } = useToolboxTabStore()
  const result = form?.form_details
    .flatMap(formItem => formItem.fields)
    .flatMap(field => field.data)
    .find(dataItem => dataItem.id === selectedField?.fieldId?.id)
  const allowedKeys = allowedEventsMap[result?.config?.details?.type] || allowedEventsMap.default
  const { closeDialog } = useDialog()
  const { showDialog } = useDialog()
  const [mainTabValue, setMainTabValue] = useState('1')
  const [subTabValue, setSubTabValue] = useState('1')
  const [conditions, setConditions] = useState<any>(result?.config?.details?.trigger?.conditions || [])
  const [selectedTriggerEvent, setSelectedTriggerEvent] = useState<string>(
    result?.config?.details?.trigger?.event || ''
  )
  const [selectedTriggerAction, setSelectedTriggerAction] = useState<string>(
    result?.config?.details?.trigger?.action?.type || ''
  )
  const [selectedApi, setSelectedApi] = useState<any | null>(null)
  const [response, setResponse] = useState('')
  const [valueAction, setValueAction] = useState({
    typeFrom: result?.config?.details?.trigger?.action?.from?.type || 'current',
    valueFrom: result?.config?.details?.trigger?.action?.from?.value || '',
    typeTo: result?.config?.details?.trigger?.action?.to?.type || 'variable',
    valueTo: result?.config?.details?.trigger?.action?.to?.value || ''
  })
  const { data: variableData } = useFetchVariableQueryOption(1, 350)
  const { data: apiLists, isPending: pendingApi } = useFetchApiQueryOption(1, 900)
  const ids = useMemo(() => getAllIdsFromData(form), [])

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

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setMainTabValue(newValue)
    setResponse('')
  }
  const handleSubChange = (event: SyntheticEvent, newValue: string) => {
    setSubTabValue(newValue)
  }

  const removeCondition = (id: string) => {
    setConditions((prev: any) => prev.filter((condition: any) => condition.id !== id))
  }

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
    closeDialog(id)
  }

  const handleCallTestApi = async () => {
    let parsedHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    parsedHeaders = {
      ...parsedHeaders,
      ...selectedApi?.headers
    }

    let parsedBody: any = undefined

    parsedBody = selectedApi?.body

    try {
      const res = await axios({
        method: selectedApi?.method.toLowerCase() as any,
        url: selectedApi?.url,
        headers: parsedHeaders,
        data: parsedBody
      })

      setResponse(JSON.stringify(res.data, null, 2))
    } catch (error: any) {
      if (isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status
          const statusText = error.response.statusText
          const data = error.response.data

          setResponse(`❌ HTTP ${status} ${error.message} ${statusText}\n${JSON.stringify(data, null, 2)}`)
        } else if (error.request) {
          // Network error (e.g., domain not found, server offline)
          setResponse(`🌐 Network error: ${error.message}`)
        } else {
          // Unknown config/setup error
          setResponse(`⚠️ Error: ${error.message}`)
        }
      } else {
        setResponse(`Unknown error: ${error.message}`)
      }
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>ตั้งค่า API</Typography>
      </Grid>

      <Grid item xs={12}>
        <div className='flex gap-4 w-full'>
          <div className='w-full'>
            {apiLists?.result?.data?.length > 0 ? (
              <CustomTextField
                select
                fullWidth
                label='เลือก API'
                value={selectedApi ?? ''}
                onChange={e => setSelectedApi(e.target.value)}
                SelectProps={{
                  displayEmpty: true
                }}
                className='mt-4'
              >
                <MenuItem value='' disabled>
                  <em className='opacity-50'>ว่าง</em>
                </MenuItem>

                {apiLists?.result?.data.map((api: any) => (
                  <MenuItem key={api.id} value={api}>
                    {api.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            ) : (
              <div className='flex items-center gap-2 mt-4'>
                <Typography>ยังไม่มี API กดเพื่อสร้าง</Typography>
                <Button
                  variant='contained'
                  onClick={() => {
                    setActiveTab('apiCall'), closeDialog(id)
                  }}
                >
                  สร้าง API
                </Button>
              </div>
            )}

            {selectedApi && (
              <div className=' mt-4'>
                <TabContext value={mainTabValue}>
                  <Grid container spacing={6} className='mb-4'>
                    <Grid item xs={12} sm={6}>
                      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                        <Tab
                          value='1'
                          label='Call Definition'
                          className={mainTabValue === '1' ? 'bg-primaryLighter' : ''}
                        />
                        <Tab
                          value='2'
                          label='Response & Test'
                          className={mainTabValue === '2' ? 'bg-primaryLighter' : ''}
                        />
                      </TabList>
                    </Grid>
                  </Grid>
                  <TabPanel value='1'>
                    <Grid container spacing={6}>
                      <Grid item xs={6}>
                        <CustomTextField
                          value={selectedApi?.name}
                          label='API Call Name'
                          fullWidth
                          placeholder='ชื่อ API'
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomTextField value={selectedApi?.method} label='Method' fullWidth placeholder='' disabled />
                      </Grid>

                      <Grid item xs={12}>
                        <CustomTextField
                          value={selectedApi?.url}
                          label='API URL'
                          fullWidth
                          placeholder='URL API'
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <TabContext value={subTabValue}>
                          <Grid container spacing={6}>
                            <Grid item xs={12} sm={8}>
                              <TabList variant='fullWidth' onChange={handleSubChange} aria-label='sub tabs'>
                                <Tab
                                  value='1'
                                  label='Headers'
                                  className={subTabValue === '1' ? 'bg-primaryLighter' : ''}
                                />

                                <Tab
                                  value='2'
                                  label='BODY'
                                  className={subTabValue === '3' ? 'bg-primaryLighter' : ''}
                                />
                              </TabList>
                            </Grid>

                            <Grid item xs={12}>
                              <TabPanel value='1'>
                                <CustomTextField
                                  label=' Headers (JSON)'
                                  multiline
                                  fullWidth
                                  rows={9}
                                  value={selectedApi?.headers ? JSON.stringify(selectedApi?.headers, null, 2) : ''}
                                  placeholder='ไม่มี'
                                />
                              </TabPanel>

                              <TabPanel value='2'>
                                <CustomTextField
                                  label=' Body (JSON)'
                                  multiline
                                  fullWidth
                                  rows={9}
                                  value={selectedApi?.body ? JSON.stringify(selectedApi?.body, null, 2) : ''}
                                  placeholder='ไม่มี'
                                />
                              </TabPanel>
                            </Grid>
                          </Grid>
                        </TabContext>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value='2'>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <Typography variant='h6' className='text-primary'>
                          * เพื่อทดสอบ API
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className='flex gap-2'>
                        <Button variant='contained' onClick={handleCallTestApi}>
                          ทดสอบ
                        </Button>
                        <Button
                          variant='contained'
                          onClick={() => {
                            setResponse('')
                          }}
                        >
                          รีเซต
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          rows={14}
                          multiline
                          fullWidth
                          label='Response'
                          value={response}
                          placeholder='ยังไม่มีผลการทดสอบ'
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </TabContext>
              </div>
            )}
          </div>
        </div>
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          autoFocus
          onClick={() => {
            closeDialog(id)
          }}
        >
          {dictionary?.cancel}
        </Button>
        <Button
          variant='contained'
          // onClick={() => {
          //   closeDialog(id), onClick()

          // }}
          onClick={handleClickSubmit}
        >
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default SettingApiFlowDialog

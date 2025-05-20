/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Button, Card, CardContent, Divider, Grid, MenuItem, Tab, Typography } from '@mui/material'
import React, { SyntheticEvent, useCallback, useRef, useState } from 'react'
import { Add, ImportExport, DoneAll, PendingActions } from '@mui/icons-material'
import VariableFormTable from './VariableFormTable'
import { useDialog } from '@/hooks/useDialog'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import CustomTextField from '@/@core/components/mui/TextField'
import TabPanel from '@mui/lab/TabPanel'
import axios from 'axios'
import { useCreateApiMediaQueryOption } from '@/queryOptions/form/formQueryOptions'
import { toast } from 'react-toastify'

const httpMethods = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' }
  // { label: 'HEAD', value: 'HEAD' },
  // { label: 'OPTIONS', value: 'OPTIONS' },
  // { label: 'CONNECT', value: 'CONNECT' },
  // { label: 'TRACE', value: 'TRACE' }
]

export const CreateApiCallFormComponent = ({ onStateCreateChange, onCreate }: any) => {
  const { showDialog } = useDialog()
  const [mainTabValue, setMainTabValue] = useState('1')
  const [subTabValue, setSubTabValue] = useState('1')
  const [methodType, setMethodType] = useState('')
  const [apiName, setApiName] = useState('')
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [response, setResponse] = useState('')
  const [headers, setHeaders] = useState('')
  const [bodyContent, setBodyContent] = useState('')
  const { mutateAsync } = useCreateApiMediaQueryOption()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setMainTabValue(newValue)
    setResponse('')
  }

  const handleSubChange = (event: SyntheticEvent, newValue: string) => {
    setSubTabValue(newValue)
  }

  const handleCallTestApi = async () => {
    if (!methodType || !apiUrl) {
      toast.error('โปรดกรอก method หรือ API Url', { autoClose: 3000 })

      return
    }

    let parsedHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (headers.trim()) {
      try {
        parsedHeaders = {
          ...parsedHeaders,
          ...JSON.parse(headers)
        }
      } catch (err) {
        toast.error('JSON ใน headers ไม่ถูกต้อง', { autoClose: 3000 })
        setResponse('⚠️ Invalid JSON in headers')
        return
      }
    }

    let parsedBody: any = undefined

    if (bodyContent.trim() && methodType !== 'GET' && methodType !== 'HEAD') {
      try {
        parsedBody = JSON.parse(bodyContent)
      } catch (err) {
        toast.error('JSON ใน BODY ไม่ถูกต้อง', { autoClose: 3000 })
        setResponse('⚠️ Invalid JSON in body')
        return
      }
    }

    try {
      const res = await axios({
        method: methodType.toLowerCase() as any,
        url: apiUrl,
        headers: parsedHeaders,
        data: parsedBody
      })

      setResponse(JSON.stringify(res.data, null, 2))
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
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
  const createApi = async () => {
    if (!apiName || !methodType || !apiUrl) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', { autoClose: 3000 })
      return
    }

    try {
      const request: any = {
        name: apiName,
        method: methodType,
        url: apiUrl
      }

      if (bodyContent.trim()) {
        try {
          request.body = JSON.parse(bodyContent)
        } catch (err) {
          toast.error('BODY ไม่ใช่ JSON ที่ถูกต้อง', { autoClose: 3000 })
          return
        }
      }

      if (headers.trim()) {
        try {
          request.headers = JSON.parse(headers)
        } catch (err) {
          toast.error('Headers ไม่ใช่ JSON ที่ถูกต้อง', { autoClose: 3000 })
          return
        }
      }

      const response = await mutateAsync(request)

      if (response?.code) {
        toast.success('สร้าง API สำเร็จ!', { autoClose: 3000 })
        onCreate(false)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('สร้าง API ล้มเหลว!', { autoClose: 3000 })
    }
  }

  return (
    <div className='w-full'>
      <Card>
        <CardContent className='min-h-[calc(100vh-64px)] p-7'>
          <Typography variant='h5' className='mt-4 mb-1'>
            สร้าง API Call
          </Typography>
          <Typography variant='body1'>ระบุชื่อและกำหนดค่าสำหรับ API Call นี้</Typography>
          <Divider className='p-2 mb-4' />

          <TabContext value={mainTabValue}>
            <Grid container spacing={6} className='mb-4'>
              <Grid item xs={12} sm={6}>
                <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                  <Tab value='1' label='Call Definition' className={mainTabValue === '1' ? 'bg-primaryLighter' : ''} />
                  <Tab value='2' label='Response & Test' className={mainTabValue === '2' ? 'bg-primaryLighter' : ''} />
                </TabList>
              </Grid>
            </Grid>
            <TabPanel value='1'>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <CustomTextField
                    value={apiName}
                    label='API Call Name'
                    fullWidth
                    placeholder='ชื่อ API'
                    onChange={e => {
                      setApiName(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    select
                    fullWidth
                    value={methodType}
                    onChange={e => setMethodType(e.target.value)}
                    label='Method Type'
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {httpMethods.map(method => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid item xs>
                  <CustomTextField
                    value={apiUrl}
                    label='API URL'
                    fullWidth
                    placeholder='URL API'
                    onChange={e => {
                      setApiUrl(e.target.value)
                    }}
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
                          <Tab value='1' label='Headers' className={subTabValue === '1' ? 'bg-primaryLighter' : ''} />
                          {/* <Tab
                            value='2'
                            label='Query Parameters'
                            className={subTabValue === '2' ? 'bg-primaryLighter' : ''}
                          /> */}
                          <Tab value='2' label='BODY' className={subTabValue === '3' ? 'bg-primaryLighter' : ''} />
                        </TabList>
                      </Grid>

                      <Grid item xs={12}>
                        <TabPanel value='1'>
                          <CustomTextField
                            label=' Headers (JSON)'
                            multiline
                            fullWidth
                            rows={9}
                            value={headers}
                            onChange={e => setHeaders(e.target.value)}
                            placeholder='{"key": "value"}'
                          />
                        </TabPanel>

                        <TabPanel value='2'>
                          <CustomTextField
                            label=' Body (JSON)'
                            multiline
                            fullWidth
                            rows={9}
                            value={bodyContent}
                            onChange={e => setBodyContent(e.target.value)}
                            placeholder='{"key": "value"}'
                          />
                        </TabPanel>
                      </Grid>
                    </Grid>
                  </TabContext>
                </Grid>
                <Grid item xs={12}>
                  <div className='flex  justify-center  gap-2 mt-6'>
                    <Button variant='contained' color='secondary' onClick={onStateCreateChange}>
                      ยกเลิก
                    </Button>
                    <Button
                      variant='contained'
                      startIcon={<Add />}
                      onClick={() => {
                        createApi()
                      }}
                    >
                      เพิ่ม API Call
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value='2'>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography variant='h6' className='text-primary'>
                    * เพิ่มข้อมูลใน Call Definition ก่อนทำการทดสอบ
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
        </CardContent>
      </Card>
    </div>
  )
}

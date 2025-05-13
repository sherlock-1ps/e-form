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

const httpMethods = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTIONS', value: 'OPTIONS' },
  { label: 'CONNECT', value: 'CONNECT' },
  { label: 'TRACE', value: 'TRACE' }
]

export const CreateApiCallFormComponent = ({ onStateCreateChange }: any) => {
  const { showDialog } = useDialog()
  const [mainTabValue, setMainTabValue] = useState('1')
  const [subTabValue, setSubTabValue] = useState('1')
  const [methodType, setMethodType] = useState('')
  const [apiName, setApiName] = useState('')
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [response, setResponse] = useState('')
  const [bodyContent, setBodyContent] = useState('')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setMainTabValue(newValue)
    setResponse('')
  }

  const handleSubChange = (event: SyntheticEvent, newValue: string) => {
    setSubTabValue(newValue)
  }

  const handleCallTestApi = async () => {
    if (!methodType || !apiUrl) {
      alert('โปรดกรอก method และ API Url')
      return
    }

    try {
      const res = await fetch(apiUrl, {
        method: methodType,
        headers: {
          'Content-Type': 'application/json'
        },
        // Optionally include a body for methods like POST/PUT/PATCH
        ...(methodType !== 'GET' && methodType !== 'HEAD' ? { body: bodyContent } : {})
      })

      const data = await res.json()
      console.log('data', data)

      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      if (error instanceof Error) {
        setResponse(`Error: ${error.message}`)
      } else {
        setResponse('Unknown error occurred')
      }
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
                          <Typography variant='h6' className='mb-2'>
                            Headers
                          </Typography>
                          <Button variant='outlined' endIcon={<Add />}>
                            Add Header
                          </Button>
                        </TabPanel>
                        {/* <TabPanel value='2'>
                          <Typography variant='h6' className='mb-2'>
                            Query Parameters
                          </Typography>
                          <Button variant='outlined' endIcon={<Add />}>
                            Query Parameters
                          </Button>
                        </TabPanel> */}
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
                    <Button variant='contained' startIcon={<Add />} onClick={() => {}}>
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
                <Grid item xs={12}>
                  <Button variant='contained' onClick={handleCallTestApi}>
                    ทดสอบ
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
                    onChange={e => setResponse(e.target.value)}
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

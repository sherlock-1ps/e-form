/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem, Tab } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import type { SyntheticEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchProviders } from '@/app/sevices/provider/provider'
import fetchProviderQueryOption, { fetchProviderTypeQueryOption } from '@/queryOptions/provider/providerQueryOptions'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { DoneAll, PendingActions } from '@mui/icons-material'
import UserDashboardTable from './UserDashboardTable'
import EditorForm from '@/components/e-form/newDefault/EditorForm'

const mockUpData = [
  {
    createdAt: '31 ม.ค. 2568 12:34',
    startedBy: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    },
    jobName: 'ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31',
    jobId: '1',
    latestStatus: {
      label: 'รออนุมัติ',
      date: '31 ม.ค. 2568 12:34',
      color: 'orange'
    },
    currentAssignee: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    }
  }
]

const mockUpDoneData = [
  {
    createdAt: '31 ม.ค. 2568 12:34',
    startedBy: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    },
    jobName: 'ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31',
    jobId: '1',
    latestStatus: {
      label: 'เสร็จสิ้น',
      date: '31 ม.ค. 2568 12:34',
      color: 'orange'
    },
    currentAssignee: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    }
  },
  {
    createdAt: '31 ม.ค. 2568 12:34',
    startedBy: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    },
    jobName: 'ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31',
    jobId: '1',
    latestStatus: {
      label: 'เสร็จสิ้น',
      date: '31 ม.ค. 2568 12:34',
      color: 'orange'
    },
    currentAssignee: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    }
  },
  {
    createdAt: '31 ม.ค. 2568 12:34',
    startedBy: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    },
    jobName: 'ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31',
    jobId: '1',
    latestStatus: {
      label: 'เสร็จสิ้น',
      date: '31 ม.ค. 2568 12:34',
      color: 'orange'
    },
    currentAssignee: {
      name: 'Name Surname',
      position: 'ตำแหน่งงาน',
      avatar: 'OP',
      online: true
    }
  }
]

const UserDashboardComponent = () => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const [value, setValue] = useState<string>('1')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <div className='flex flex-col gap-6'>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                  <Tab
                    value='1'
                    label='งานที่อยู่ระหว่างดำเนินการ'
                    icon={<PendingActions />}
                    iconPosition={'start'}
                    className={value === '1' ? 'bg-primaryLighter' : ''}
                  />
                  <Tab
                    value='2'
                    label='งานที่จบแล้ว'
                    icon={<DoneAll />}
                    iconPosition={'start'}
                    className={value === '2' ? 'bg-primaryLighter' : ''}
                  />
                </TabList>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <TabPanel value='1'>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='เลือกเวิร์คโฟลว์'
                    SelectProps={{
                      displayEmpty: true
                    }}
                  >
                    <MenuItem value='' disabled>
                      <em className=' opacity-50'>เลือกเวิร์คโฟลว์</em>
                    </MenuItem>
                    <MenuItem value={10}>ขอเบิกเงินค่าเช่า (6006)</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <UserDashboardTable
                    projectTable={mockUpData}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                  />
                </Grid>
                <Divider />
              </Grid>
            </TabPanel>
            <TabPanel value='2'>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='เลือกเวิร์คโฟลว์'
                    SelectProps={{
                      displayEmpty: true
                    }}
                  >
                    <MenuItem value='' disabled>
                      <em className=' opacity-50'>เลือกเวิร์คโฟลว์</em>
                    </MenuItem>
                    <MenuItem value={10}>ขอเบิกเงินค่าเช่า (6006)</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <UserDashboardTable
                    projectTable={mockUpDoneData}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                  />
                </Grid>
                <Divider />
              </Grid>
            </TabPanel>
          </CardContent>
        </Card>
        {/* <Card>
          <CardContent>
            <EditorForm />
          </CardContent>
        </Card> */}
      </div>
    </TabContext>
  )
}

export default UserDashboardComponent

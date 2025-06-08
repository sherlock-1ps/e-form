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
import EditorForm from '@/components/e-form/newDefault/EditorForm'
import { useFetchFlowNnameQueryOption, useFetchWorkInProgressQueryOption } from '@/queryOptions/form/formQueryOptions'
import UserDashboardTable from '../dashboard/UserDashboardTable'

const UserFollowTaskComponent = () => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')

  const { data: flowData } = useFetchFlowNnameQueryOption(1, 999)
  const { data: workPregressData } = useFetchWorkInProgressQueryOption(page, pageSize, Number(selectedWorkflow), {
    enabled: selectedWorkflow !== ''
  })

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5'>งานที่กำลังติดตาม</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                select
                fullWidth
                label='เลือกเวิร์คโฟลว์'
                value={selectedWorkflow}
                onChange={e => setSelectedWorkflow(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value='' disabled>
                  <em className='opacity-50'>เลือกเวิร์คโฟลว์</em>
                </MenuItem>

                {flowData?.result?.data?.map((item: any) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              {/* <UserDashboardTable
                projectTable={workPregressData?.result?.data || []}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                count={workPregressData?.result?.total}
              /> */}
            </Grid>
            <Divider />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserFollowTaskComponent

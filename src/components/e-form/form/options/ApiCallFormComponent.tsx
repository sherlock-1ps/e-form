'use client'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'

import { useApiCallStore } from '@/store/useApiCallStore'
import { CreateApiCallFormComponent } from './CreateApiCallFormComponent'
import { EditApiCallFormComponent } from './EditApiCallFormComponent'
import ApiCallFormTable from './ApiCallFormTable'
import { useFetchApiQueryOption } from '@/queryOptions/form/formQueryOptions'

const mockDataApiCall = [
  {
    name: 'testAPI',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1'
  },
  {
    name: 'testAPI',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts/2'
  },
  {
    name: 'API1234',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/3'
  },
  {
    name: 'APICALL',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts/4'
  }
]

export const ApiCallFormComponent = () => {
  const selectedApi = useApiCallStore(state => state.selectedApi)
  const addApis = useApiCallStore(state => state.addApis)
  const [isCreateApiCall, setIsCreateApiCall] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const { data: apiLists, isPending: pendingApi } = useFetchApiQueryOption(page, pageSize)

  const handleCloseCreate = () => setIsCreateApiCall(false)
  const handleEditApiCall = (key: string) => {
    // implement as needed
  }

  useEffect(() => {
    if (apiLists?.result?.data.length > 0) {
      addApis(apiLists?.result?.data)
    }
  }, [apiLists])

  useEffect(() => {
    setIsCreateApiCall(false)
  }, [selectedApi])

  // Renders when creating a new API
  if (isCreateApiCall) {
    return <CreateApiCallFormComponent onStateCreateChange={handleCloseCreate} onCreate={setIsCreateApiCall} />
  }

  // Renders when editing an existing API
  if (selectedApi) {
    return <EditApiCallFormComponent />
  }

  // Default: list view with "Add API Call" button
  return (
    <div className='w-full'>
      <Card>
        <CardContent className='min-h-[calc(100vh-64px)] p-7'>
          <Typography variant='h5' className='mt-4 mb-1'>
            กำหนด API Call
          </Typography>
          <Typography variant='body1'>ระบุชื่อและกำหนดค่าสำหรับ API Call นี้</Typography>
          <Divider className='p-2 mb-4' />

          <Grid container spacing={4}>
            <Grid item xs={12} display='flex' justifyContent='flex-end' className='gap-2'>
              <Button variant='contained' startIcon={<Add />} onClick={() => setIsCreateApiCall(true)}>
                เพิ่ม API Call
              </Button>
            </Grid>
            {pendingApi && (
              <Grid item xs={12}>
                <Typography>กำลังโหลด....</Typography>
              </Grid>
            )}

            {apiLists?.result?.data?.length > 0 ? (
              <Grid item xs={12}>
                <ApiCallFormTable
                  data={apiLists?.result}
                  onEditApi={handleEditApiCall}
                  page={page}
                  pageSize={pageSize}
                  setPage={setPage}
                  setPageSize={setPageSize}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <div className='flex flex-col gap-4 items-center justify-center h-[60vh] text-gray-500'>
                  <img src='/images/dtn-logo-lg.png' alt='No data' className='w-[360px]' />
                  <Typography variant='body1' className='text-primary'>
                    ยังไม่ได้มีการกำหนด API Call ใดๆ
                  </Typography>
                  <Typography variant='body2'>กดปุ่มเพิ่มด้านบน เพื่อลองสร้างครั้งแรก</Typography>
                </div>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import { Add } from '@mui/icons-material'
import VariableFormTable from './VariableFormTable'
import { useDialog } from '@/hooks/useDialog'
import CreateVariableFormDialog from '@/components/dialogs/form/CreateVariableFormDialog'
import { useFetchVariableQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'
export const VariableFormComponent = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: variableData,
    isPending: pendingVariableData,
    error: errorVariableData,
    refetch
  } = useFetchVariableQueryOption(page, pageSize)

  return (
    <div className='w-full'>
      <Card>
        <CardContent className='min-h-[calc(100vh-64px)] p-7'>
          <Typography variant='h5' className='mt-4 mb-1'>
            ตัวแปร
          </Typography>
          <Typography variant='body1'>จัดการตัวแปรทั้งหมดในโครงการของคุณ</Typography>
          <Divider className='p-2 mb-4' />

          <Grid container spacing={4}>
            <Grid item xs={12} display='flex' justifyContent='flex-end'>
              <Button
                variant='contained'
                startIcon={<Add />}
                onClick={() => {
                  showDialog({
                    id: 'CreateVariableFormDialog',
                    component: <CreateVariableFormDialog id='CreateVariableFormDialog' onClick={() => {}} />,
                    size: 'sm'
                  })
                }}
              >
                เพิ่มตัวแปร
              </Button>
            </Grid>
            {pendingVariableData && (
              <Grid item xs={12}>
                <Typography>{dictionary?.loading}</Typography>
              </Grid>
            )}
            {variableData?.code == 'SUCCESS' && !pendingVariableData && (
              <Grid item xs={12}>
                <VariableFormTable
                  data={variableData?.result || []}
                  page={page}
                  pageSize={pageSize}
                  setPage={setPage}
                  setPageSize={setPageSize}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

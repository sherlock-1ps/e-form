'use client'

import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { useDialog } from '@/hooks/useDialog'
import {
  useFetchFlowNnameQueryOption,
  useFetchFlowQueryOption,
  useGetFlowQueryOption,
  useStartFlowQueryOption
} from '@/queryOptions/form/formQueryOptions'
// MUI Imports
import { Button, Card, CardContent, Grid, Pagination, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useFlowStore } from '@/store/useFlowStore'
import { useFormStore } from '@/store/useFormStore'
import MockupSummaryConponent from './MockupSummaryConponent'
import MockupReportComponent from './MockupReportComponent'

const ReportTastkComponent = () => {
  const { showDialog } = useDialog()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [currentSection, setCurrentSection] = useState('dashboard')

  if (currentSection == 'summary')
    return (
      <MockupReportComponent
        onBack={() => {
          setCurrentSection('dashboard')
        }}
      />
    )

  if (currentSection == 'report')
    return (
      <MockupSummaryConponent
        onBack={() => {
          setCurrentSection('dashboard')
        }}
      />
    )

  return (
    <Card>
      <CardContent
        style={{ backgroundColor: '#E9EAEF' }}
        className='min-h-[calc(100vh-3rem)] flex flex-col justify-between'
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent className='flex flex-col gap-6'>
                <Typography variant='h6'>รายงานการประเมินแบบสำรวจ (พึงพอใจบริการของหน้าห้องผู้บริหาร)</Typography>

                <div className='flex flex-col gap-2'>
                  <Typography variant='body2'>คำบรรยาย</Typography>
                  <Typography variant='body2' className='break-words line-clamp-2 min-h-[2.5rem]'>
                    .....
                  </Typography>
                </div>

                <div className='flex gap-4 items-center justify-end h-[40px]'>
                  <Button
                    variant='contained'
                    className='h-full text-sm'
                    onClick={() => {
                      showDialog({
                        id: 'alertDialogConfirmToggleTrigger',
                        component: (
                          <ConfirmAlert
                            id='alertDialogConfirmToggleTrigger'
                            title='ดูการประเมิน'
                            content1='คุณต้องการใช้ดูการประเมินนี้ ใช่หรือไม่'
                            onClick={() => {
                              setCurrentSection('summary')
                            }}
                          />
                        ),
                        size: 'sm'
                      })
                    }}
                  >
                    ดูการประเมิน
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent className='flex flex-col gap-6'>
                <Typography variant='h6'>รายงานสรุปแบบสำรวจ (พึงพอใจบริการของหน้าห้องผู้บริหาร)</Typography>

                <div className='flex flex-col gap-2'>
                  <Typography variant='body2'>คำบรรยาย</Typography>
                  <Typography variant='body2' className='break-words line-clamp-2 min-h-[2.5rem]'>
                    .....
                  </Typography>
                </div>

                <div className='flex gap-4 items-center justify-end h-[40px]'>
                  <Button
                    variant='contained'
                    className='h-full text-sm'
                    onClick={() => {
                      showDialog({
                        id: 'alertDialogConfirmToggleTrigger',
                        component: (
                          <ConfirmAlert
                            id='alertDialogConfirmToggleTrigger'
                            title='ดูรายงานสรุป'
                            content1='คุณต้องการดูรายงานสรุปนี้ ใช่หรือไม่'
                            onClick={() => {
                              setCurrentSection('report')
                            }}
                          />
                        ),
                        size: 'sm'
                      })
                    }}
                  >
                    ดูรายงานสรุป
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <div className='flex justify-center mt-4'>
          <Pagination
            shape='rounded'
            color='primary'
            variant='tonal'
            count={Math.ceil(0 / pageSize)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            showFirstButton
            showLastButton
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportTastkComponent

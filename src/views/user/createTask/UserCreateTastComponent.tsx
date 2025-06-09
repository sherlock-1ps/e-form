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
import UserStartTaskComponent from './start/UserStartTaskComponent'
import ViewWorkflowComponent from './ViewWorkflowComponent'
import { useFlowStore } from '@/store/useFlowStore'
import { useFormStore } from '@/store/useFormStore'

const UserCreateTastComponent = () => {
  const { showDialog } = useDialog()
  const setFlowDiagramData = useFlowStore(state => state.setFlowDiagramData)
  const setFullForm = useFormStore(state => state.setFullForm)
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [dataStartFlow, setDataStartFlow] = useState({})
  const [selectedViewFlow, setSelectedViewFlow] = useState(0)

  // const { data: flowNameData, isPending: pendingFlow } = useFetchFlowNnameQueryOption(page, pageSize)
  const { data: flowNameData, isPending: pendingFlow } = useFetchFlowQueryOption(page, pageSize)
  const { mutateAsync: getFlow, isPending: pendingGetFlow } = useGetFlowQueryOption()

  const { mutateAsync: callStartFlow } = useStartFlowQueryOption()

  const handleStartFlow = async (item: any) => {
    try {
      const response = await callStartFlow({ id: item.id })

      if (response?.code == 'SUCCESS') {
        const resultFlow = {
          flow: {
            ...response?.result?.data?.flow
          }
        }

        const layoutValue =
          response?.result?.data?.form_detail?.detail?.layout === 'horizontal' ? 'horizontal' : 'vertical'
        const formFromApi = {
          isContinue: true,
          name: item?.name,
          formId: response?.result?.data?.form_detail?.id,
          versionId: response?.result?.data?.form_detail?.form_version_id,
          layout: layoutValue as 'vertical' | 'horizontal',
          form_details: response?.result?.data?.form_detail?.detail?.data
        }

        setFlowDiagramData(resultFlow)
        setFullForm(formFromApi)
        setDataStartFlow(response?.result?.data)

        setTimeout(() => {
          setCurrentSection('startFlow')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 350)
      }
    } catch (error) {
      toast.error('เริ่มโฟลว์ล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleShowWorkflow = async (id: number) => {
    try {
      const response = await getFlow(id)

      if (response?.code == 'SUCCESS') {
        const resultFlow = {
          flow: {
            ...response?.result?.data?.flow
          }
        }

        setFlowDiagramData(resultFlow)

        setCurrentSection('viewFlow')
      }
    } catch (error) {
      toast.error('เรียกโฟลว์ล้มเหลว!', { autoClose: 3000 })
    }
  }

  if (currentSection === 'startFlow') return <UserStartTaskComponent data={dataStartFlow} />

  if (currentSection === 'viewFlow' && selectedViewFlow)
    return (
      <ViewWorkflowComponent
        onBack={() => {
          setCurrentSection('dashboard')
        }}
        name={selectedViewFlow}
      />
    )

  return (
    <Card>
      <CardContent
        style={{ backgroundColor: '#E9EAEF' }}
        className='min-h-[calc(100vh-3rem)] flex flex-col justify-between'
      >
        <Grid container spacing={4}>
          {pendingFlow && (
            <Grid item xs={12}>
              <Typography>กำลังโหลด...</Typography>
            </Grid>
          )}
          {flowNameData?.result?.data?.length > 0 ? (
            flowNameData?.result?.data?.map((item: any, index: number) => {
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent className='flex flex-col gap-6'>
                      <Typography variant='h6'>{item.name}</Typography>

                      <div className='flex flex-col gap-2'>
                        <Typography variant='body2'>คำบรรยาย</Typography>
                        <Typography variant='body2' className='break-words line-clamp-2 min-h-[2.5rem]'>
                          .....
                        </Typography>
                      </div>

                      <div className='flex gap-4 items-center justify-end h-[40px]'>
                        <Button
                          variant='outlined'
                          color='secondary'
                          className='h-full text-sm'
                          onClick={() => {
                            setSelectedViewFlow(item?.name)
                            handleShowWorkflow(item?.version?.[0]?.id)
                          }}
                        >
                          ดูเวิร์คโฟลว์
                        </Button>
                        <Button
                          variant='contained'
                          className='h-full text-sm'
                          onClick={() => {
                            showDialog({
                              id: 'alertDialogConfirmToggleTrigger',
                              component: (
                                <ConfirmAlert
                                  id='alertDialogConfirmToggleTrigger'
                                  title='เริ่มต้นใช้งาน'
                                  content1='คุณต้องการใช้งานโฟลว์นี้ ใช่หรือไม่'
                                  onClick={() => {
                                    handleStartFlow(item)
                                  }}
                                />
                              ),
                              size: 'sm'
                            })
                          }}
                        >
                          เริ่มต้นใช้งาน
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          ) : (
            <Grid item xs={12}>
              <Typography>ยังไม่มี Flow ที่สามารถสร้างงานได้</Typography>
            </Grid>
          )}
        </Grid>
        <div className='flex justify-center mt-4'>
          <Pagination
            shape='rounded'
            color='primary'
            variant='tonal'
            count={Math.ceil((flowNameData?.result?.total || 0) / pageSize)}
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

export default UserCreateTastComponent

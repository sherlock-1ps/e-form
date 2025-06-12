// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Card, CardContent, Divider, Grid, MenuItem, Pagination, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  useChangeRoleAccountOwnerMutationOption,
  useFetchRoleQueryOption
} from '@/queryOptions/account/accountQueryOptions'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useFetchFlowQueryOption, useGetFlowQueryOption } from '@/queryOptions/form/formQueryOptions'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useFlowStore } from '@/store/useFlowStore'
import ViewWorkflowComponent from '../createTask/ViewWorkflowComponent'

interface confirmProps {
  id: string
  onStartFlow: any
}

const UserCreateTaskDialog = ({ id, onStartFlow }: confirmProps) => {
  const { closeDialog, showDialog } = useDialog()
  const { dictionary } = useDictionary()
  const setFlowDiagramData = useFlowStore(state => state.setFlowDiagramData)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [dataStartFlow, setDataStartFlow] = useState({})
  const [selectedViewFlow, setSelectedViewFlow] = useState(0)

  const { data: flowNameData, isPending: pendingFlow } = useFetchFlowQueryOption(page, pageSize)
  const { mutateAsync: getFlow, isPending: pendingGetFlow } = useGetFlowQueryOption()

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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>สร้างงานใหม่</Typography>
      </Grid>

      {pendingFlow && (
        <Grid item xs={12}>
          <Typography>กำลังโหลด...</Typography>
        </Grid>
      )}

      {flowNameData?.result?.data?.length > 0 ? (
        flowNameData.result.data.map((item: any, index: number) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent className='flex flex-col gap-6'>
                <Typography variant='h6'>{item.name}</Typography>

                <div className='flex flex-col gap-2 mt-2'>
                  <Typography variant='body2'>คำบรรยาย</Typography>
                  <Typography variant='body2' className='break-words line-clamp-2 min-h-[2.5rem]'>
                    .....
                  </Typography>
                </div>

                <div className='flex gap-4 items-center justify-end h-[40px] mt-4'>
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
                              onStartFlow('', 'start', item.id)
                              closeDialog(id)
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
        ))
      ) : (
        <Grid item xs={12}>
          <Typography>ยังไม่มี Flow ที่สามารถสร้างงานได้</Typography>
        </Grid>
      )}

      <Grid item xs={12} className='flex justify-center mt-4'>
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
      </Grid>
    </Grid>
  )
}

export default UserCreateTaskDialog

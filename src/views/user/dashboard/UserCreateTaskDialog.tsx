// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, MenuItem, Pagination, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  useChangeRoleAccountOwnerMutationOption,
  useFetchRoleQueryOption
} from '@/queryOptions/account/accountQueryOptions'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useFetchFlowQueryOption } from '@/queryOptions/form/formQueryOptions'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'

interface confirmProps {
  id: string
  onClick?: () => void
}

const UserCreateTaskDialog = ({ id, onClick }: confirmProps) => {
  const { closeDialog, showDialog } = useDialog()
  const { dictionary } = useDictionary()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [dataStartFlow, setDataStartFlow] = useState({})
  const [selectedViewFlow, setSelectedViewFlow] = useState(0)

  const { data: flowNameData, isPending: pendingFlow } = useFetchFlowQueryOption(page, pageSize)

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>สร้างงานใหม่</Typography>
      </Grid>
      {pendingFlow && (
        <Grid item xs={12}>
          <Typography>กำลังโหลด...</Typography>
        </Grid>
      )}
      {flowNameData?.result?.data?.length > 0 ? (
        flowNameData?.result?.data?.map((item: any, index: number) => {
          return (
            <Grid item xs={12} md={4} key={index}>
              <Typography variant='h6'>{item.name}</Typography>

              <div className='flex flex-col gap-2'>
                <Typography variant='body2'>คำบรรยาย</Typography>
                <Typography variant='body2' className='break-words line-clamp-2 min-h-[2.5rem]'>
                  .....
                </Typography>
              </div>

              <div className='flex gap-4 items-center justify-end h-[40px]'>
                <Button variant='outlined' color='secondary' className='h-full text-sm' onClick={() => {}}>
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
                          onClick={() => {}}
                        />
                      ),
                      size: 'sm'
                    })
                  }}
                >
                  เริ่มต้นใช้งาน
                </Button>
              </div>
            </Grid>
          )
        })
      ) : (
        <Grid item xs={12}>
          <Typography>ยังไม่มี Flow ที่สามารถสร้างงานได้</Typography>
        </Grid>
      )}
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
    </Grid>
  )
}

export default UserCreateTaskDialog

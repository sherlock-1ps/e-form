'use client'

import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { useDialog } from '@/hooks/useDialog'
import { useFetchFlowNnameQueryOption, useStartFlowQueryOption } from '@/queryOptions/form/formQueryOptions'
// MUI Imports
import { Button, Card, CardContent, Grid, Pagination, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import UserStartTaskComponent from './start/UserStartTaskComponent'

const mockCards = [
  {
    id: 1,
    title: 'ขออนุมัติเบิกค่าเช่าบ้าน (6005)',
    description: 'คำอธิบายสำหรับงานที่เกี่ยวข้องกับเบิกค่าเช่าบ้าน'
  },
  {
    id: 2,
    title: 'ขออนุมัติค่าเดินทาง (6006)',
    description: 'ค่าใช้จ่ายสำหรับการเดินทางไปประชุมต่างจังหวัด'
  },
  {
    id: 3,
    title: 'ขออนุมัติซื้ออุปกรณ์สำนักงาน',
    description: 'ซื้อเครื่องเขียนและวัสดุสิ้นเปลืองสำหรับแผนก'
  },
  {
    id: 4,
    title: 'ขออนุมัติเบี้ยเลี้ยงพนักงาน',
    description: 'เบี้ยเลี้ยงสำหรับพนักงานปฏิบัติงานนอกสถานที่'
  },
  {
    id: 5,
    title: 'ขออนุมัติโครงการพัฒนาระบบ',
    description: 'เอกสารขออนุมัติสำหรับเริ่มต้นโครงการ IT ใหม่'
  },
  {
    id: 6,
    title: 'ขออนุมัติอบรมภายในองค์กร',
    description: 'หลักสูตรอบรมสำหรับพนักงานในองค์กร'
  },
  {
    id: 7,
    title: 'ขออนุมัติจ้างที่ปรึกษา',
    description: 'ขออนุมัติค่าจ้างผู้เชี่ยวชาญจากภายนอก'
  },
  {
    id: 8,
    title: 'ขออนุมัติปรับปรุงสถานที่',
    description: 'งานปรับปรุงสำนักงาน และห้องประชุม'
  },
  {
    id: 9,
    title: 'ขออนุมัติซื้อซอฟต์แวร์',
    description: 'ระบบซอฟต์แวร์บริหารจัดการโครงการ'
  }
]

const UserCreateTastComponent = () => {
  const { showDialog } = useDialog()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [startFlow, setStartFlow] = useState(false)

  const { data: flowNameData, isPending: pendingFlow } = useFetchFlowNnameQueryOption(page, pageSize)
  const { mutateAsync: callStartFlow } = useStartFlowQueryOption()

  const handleStartFlow = async (id: any) => {
    try {
      const response = await callStartFlow({ id })

      if (response?.code == 'SUCCESS') {
        toast.success('เริ่มต้นโฟลว์สำเร็จ!', { autoClose: 3000 })
        setStartFlow(true)
      }
    } catch (error) {
      toast.error('เริ่มโฟลว์ล้มเหลว!', { autoClose: 3000 })
    }
  }
  return startFlow ? (
    <UserStartTaskComponent />
  ) : (
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
                        <Button variant='outlined' color='secondary' className='h-full text-sm'>
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
                                    handleStartFlow(item?.id)
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

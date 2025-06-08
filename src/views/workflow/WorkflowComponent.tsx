'use client'

import { Grid, Typography, Button, CardContent, Card, CircularProgress, Pagination } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import { useDispatch } from 'react-redux'

import Link from '@/components/Link'
import { useParams, useRouter } from 'next/navigation'
import DashboardNavbarContent from '@/components/layout/vertical/navbar/DashboardNavbarContent'
import { useDialog } from '@/hooks/useDialog'
import CreateFormDialog from '@/components/dialogs/form/CreateFormDialog'
import OptionMenu from '@/@core/components/option-menu'
import { Edit, FileCopy, EditCalendar, Delete, CreateNewFolder, AccountTreeOutlined } from '@mui/icons-material'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import EditVersionFlowDialog from '@/components/dialogs/flow/EditVersionFlowDialog'
import DateUseFlowDialog from '@/components/dialogs/flow/DateUseFlowDialog'
import {
  useDeleteFlowQueryOption,
  useFetchFlowQueryOption,
  useGetFlowQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useFormStore } from '@/store/useFormStore'
import { formatThaiDate } from '@/utils/formatDateTime'
import { useFlowStore } from '@/store/useFlowStore'
import CreateFlowDialog from '@/components/dialogs/form/CreateFlowDialog'

const WorkflowComponent = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const { showDialog } = useDialog()
  const setFullFlow = useFlowStore(state => state.setFullFlow)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const { data, isPending } = useFetchFlowQueryOption(page, pageSize)

  const { mutateAsync: deleteFlow } = useDeleteFlowQueryOption()

  const { mutateAsync: getFlow, isPending: pendingGetFlow } = useGetFlowQueryOption()

  const ImageCard = ({ title, image, date, status, version, onDelete, data, onGetForm }: any) => (
    <div className='flex flex-col p-4 bg-white rounded-md max-w-[220px] w-[220px] h-[275px] border shadow-md'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Typography variant='h6' className='text-start pb-2'>
          {title}
        </Typography>
        <OptionMenu
          iconButtonProps={{ size: 'medium' }}
          iconClassName='text-secondary'
          options={[
            {
              text: 'แก้ไข',
              icon: pendingGetFlow ? <CircularProgress size={20} /> : <Edit />,
              menuItemProps: {
                disabled: pendingGetFlow,
                className: 'text-secondary',
                onClick: () => onGetForm(data)
              }
            },
            {
              text: 'เวอร์ชั่นใหม่',
              icon: <CreateNewFolder />,
              menuItemProps: {
                className: 'text-secondary',
                onClick: () => {
                  showDialog({
                    id: 'alertEditVersionFlowDialog',
                    component: <EditVersionFlowDialog id='alertEditVersionFlowDialog' data={data} onClick={() => {}} />,
                    size: 'sm'
                  })
                }
              }
            },
            {
              text: 'กำหนดวันใช้งาน',
              icon: <EditCalendar />,
              menuItemProps: {
                className: 'text-secondary',
                onClick: () => {
                  showDialog({
                    id: 'alertDateUseFlowDialog',
                    component: <DateUseFlowDialog id='alertDateUseFlowDialog' data={data} />,
                    size: 'sm'
                  })
                }
              }
            },
            {
              text: 'ลบ',
              icon: <Delete />,
              menuItemProps: {
                className: 'text-error',
                onClick: () => {
                  showDialog({
                    id: 'alertDeleteForm',
                    component: (
                      <ConfirmAlert
                        id='alertDeleteForm'
                        title={'ลบโฟลว์'}
                        content1={`คุณต้องการลบโฟลว์นี้ใช่หรือไม่`}
                        onClick={() => onDelete(data?.id)}
                        // onClick={() => onDelete(data?.version?.[0].id)}
                      />
                    ),
                    size: 'sm'
                  })
                }
              }
            }
          ]}
        />
      </div>

      {/* Version info */}
      <div className='flex justify-between'>
        <Typography className='text-start italic' variant='body2'>
          เวอร์ชั่น
        </Typography>
        <Typography className='text-end italic' variant='body2'>
          {version}
        </Typography>
      </div>

      {/* Image container */}
      <div className='flex-1 my-2 rounded overflow-hidden'>
        {/* <img src={image} alt={title} className='w-full h-full object-cover' /> */}
        <Typography className=' h-full bg-slate-100 flex items-center justify-center text-wrap' variant='body2'>
          {title}
        </Typography>
        {/* Or if you want just black placeholder: <div className='w-full h-full bg-black' /> */}
      </div>

      {/* Date */}
      <Typography variant='body2' className='text-end'>
        {date}
      </Typography>
    </div>
  )

  const handleDeleteFlow = async (id: number) => {
    const request = {
      id: id
    }

    try {
      const response = await deleteFlow(request)
      if (response?.code == 'SUCCESS') {
        toast.success('ลบโฟลว์สำเร็จแล้ว!', { autoClose: 3000 })
      }
    } catch (error) {
      toast.error('ลบโฟลว์ล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleGetForm = async (data: any) => {
    try {
      const response = await getFlow(data?.version?.[0]?.id)

      if (response?.code == 'SUCCESS') {
        const result = {
          isContinue: true,
          versionId: data?.version[0]?.id,
          name: data?.name,
          flowId: data?.id,
          version: data?.version[0]?.version,
          newVersion: '',
          publicDate: '',
          endDate: '',
          flow: {
            ...response?.result?.data?.flow
          }
        }

        setFullFlow(result)
        router.push(`/${locale}/admin/workflow`)
      }
    } catch (error) {
      toast.error('เรียกโฟลว์ล้มเหลว!', { autoClose: 3000 })
    }
  }

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <DashboardNavbarContent />
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardContent className='min-h-[calc(100vh-160px)] flex flex-col gap-4'>
            <Typography variant='h5'>จัดการเวิร์กโฟลว์</Typography>

            <div className='flex gap-4 flex-wrap'>
              <Button
                className={`w-[200px] h-[262px] rounded-md  flex  items-center justify-center`}
                style={{ backgroundColor: '#0463EA14' }}
                onClick={() => {
                  showDialog({
                    id: 'alertCreateFlowDialog',
                    component: <CreateFlowDialog id='alertCreateFlowDialog' onClick={() => {}} />,
                    size: 'sm'
                  })
                }}
              >
                <AddIcon sx={{ color: '#0463EA' }} />
              </Button>
              {isPending && <Typography>กำลังโหลด...</Typography>}
              {data?.code == 'SUCCESS' &&
                !isPending &&
                data?.result?.data.length > 0 &&
                data?.result?.data.map((item: any, index: number) => {
                  return (
                    <ImageCard
                      key={index}
                      title={item?.name}
                      version={item?.version?.[0]?.version ?? ''}
                      data={item}
                      image='/images/test/test01.png'
                      date={`แก้ไขล่าสุด ${formatThaiDate(item?.created_at)}`}
                      status={'ใช้งานอยู่'}
                      onDelete={handleDeleteFlow}
                      onGetForm={handleGetForm}
                    />
                  )
                })}
            </div>
            <div className='flex justify-center mt-4'>
              <Pagination
                shape='rounded'
                color='primary'
                variant='tonal'
                count={Math.ceil((data?.result?.total || 0) / pageSize)}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                showFirstButton
                showLastButton
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default WorkflowComponent

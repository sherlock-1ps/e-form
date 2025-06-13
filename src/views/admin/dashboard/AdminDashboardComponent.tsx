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
import EditVersionFormDialog from '@/components/dialogs/form/EditVersionFormDialog'
import DateUseFormDialog from '@/components/dialogs/form/DateUseFormDialog'
import {
  useCreateNewVersionFormQueryOption,
  useDeleteFormQueryOption,
  useFetchFormQueryOption,
  useGetFormQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useFormStore } from '@/store/useFormStore'
import { formatThaiDate } from '@/utils/formatDateTime'

const AdminDashboardComponent = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const { showDialog } = useDialog()
  const setFullForm = useFormStore(state => state.setFullForm)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const { data, isPending } = useFetchFormQueryOption(page, pageSize)

  const { mutateAsync: deleteForm } = useDeleteFormQueryOption()

  const { mutateAsync: getForm, isPending: pendingGetForm } = useGetFormQueryOption()

  const ImageCard = ({ title, image, date, status, version, onDelete, data, onGetForm }: any) => (
    <div className='flex flex-col p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl w-[220px] min-h-[275px] border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='flex items-start justify-between'>
        <Typography variant='h6' className='text-start font-semibold leading-snug break-words max-w-[150px]'>
          {title}
        </Typography>
        <OptionMenu
          iconButtonProps={{ size: 'small' }}
          iconClassName='text-secondary'
          options={[
            {
              text: 'แก้ไข',
              icon: pendingGetForm ? <CircularProgress size={20} /> : <Edit />,
              menuItemProps: {
                disabled: pendingGetForm,
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
                    id: 'alertEditVersionFormDialog',
                    component: <EditVersionFormDialog id='alertEditVersionFormDialog' data={data} onClick={() => {}} />,
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
                    id: 'alertDateUseFormDialog',
                    component: <DateUseFormDialog id='alertDateUseFormDialog' data={data} />,
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
                        title='ลบฟอร์ม'
                        content1='คุณต้องการลบฟอร์มนี้ใช่หรือไม่'
                        onClick={() => onDelete(data?.id)}
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
      <div className='flex justify-between mt-1 text-xs text-gray-500'>
        <span>เวอร์ชั่น</span>
        <span>{version}</span>
      </div>
      {/* Image or Placeholder */}
      <div className='flex-1 my-2 bg-slate-100 rounded-md flex items-center justify-center text-center px-2 py-2 text-sm text-gray-600'>
        <span className='line-clamp-3'>{title}</span>
      </div>
      {/* Date */}
      <Typography variant='caption' className='text-right text-gray-500'>
        {date}
      </Typography>
    </div>
  )

  const handleDeleteForm = async (id: number) => {
    const request = {
      id: id
    }

    try {
      const response = await deleteForm(request)
      if (response?.code == 'SUCCESS') {
        toast.success('ลบฟอร์มสำเร็จแล้ว!', { autoClose: 3000 })
      }
    } catch (error) {
      toast.error('ลบฟอร์มล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleGetForm = async (data: any) => {
    const request = {
      id: data?.version?.[0]?.id
    }

    try {
      const response = await getForm(request)
      if (response?.code == 'SUCCESS') {
        const layoutValue =
          response?.result?.data?.FormDetails?.[0]?.detail?.layout === 'horizontal' ? 'horizontal' : 'vertical'

        const formFromApi = {
          isContinue: true,
          formId: data?.id,
          versionId: data?.version[0]?.id,
          name: data?.name,
          version: response?.result?.data?.version,
          newVersion: response?.result?.data?.version,
          layout: layoutValue as 'vertical' | 'horizontal',
          form_details: response?.result?.data?.FormDetails[0]?.detail?.data
        }

        setFullForm(formFromApi)
        router.push(`/${locale}/admin/form`)
      }
    } catch (error) {
      toast.error('เรียกฟอร์มล้มเหลว!', { autoClose: 3000 })
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
            <Typography variant='h5'>จัดการแบบฟอร์ม</Typography>

            <div className='flex gap-4 flex-wrap'>
              <Button
                className={`w-[200px] min-h-[262px] rounded-md  flex  items-center justify-center`}
                style={{ backgroundColor: '#0463EA14' }}
                onClick={() => {
                  showDialog({
                    id: 'alertCreateFormDialog',
                    component: <CreateFormDialog id='alertCreateFormDialog' onClick={() => {}} />,
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
                      onDelete={handleDeleteForm}
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

export default AdminDashboardComponent

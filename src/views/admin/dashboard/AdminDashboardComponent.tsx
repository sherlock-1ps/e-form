'use client'

import { Grid, Typography, Button, CardContent, Card } from '@mui/material'

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
import { useDeleteFormQueryOption, useFetchFormQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useState } from 'react'
import { toast } from 'react-toastify'

const AdminDashboardComponent = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const { showDialog } = useDialog()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(99)
  const { data, isPending } = useFetchFormQueryOption(page, pageSize)

  const { mutateAsync: deleteForm } = useDeleteFormQueryOption()

  const ImageCard = ({ title, image, date, status, version, onDelete, data }: any) => (
    <div className=' p-4 bg-white  rounded-md  max-w-[200px] h-[262px] max-h-[262px] border shadow-md'>
      <div className='flex items-center justify-between'>
        <Typography variant='h6' className='text-start overflow-hidden text-ellipsis whitespace-nowrap'>
          {title}
        </Typography>
        <OptionMenu
          iconButtonProps={{
            size: 'medium'
          }}
          iconClassName='text-secondary'
          options={[
            {
              text: 'แก้ไข',
              icon: <Edit />,
              menuItemProps: {
                className: ' text-secondary',
                onClick: () => {
                  onDelete(data?.id)
                }
              }
            },
            {
              text: 'เวอร์ชั่นใหม่',
              icon: <CreateNewFolder />,
              menuItemProps: {
                className: ' text-secondary',
                onClick: () => {
                  showDialog({
                    id: 'alertEditVersionFormDialog',
                    component: <EditVersionFormDialog id='alertEditVersionFormDialog' onClick={() => {}} />,
                    size: 'sm'
                  })
                }
              }
            },
            {
              text: 'ทำสำเนา',
              icon: <FileCopy />,
              menuItemProps: { className: ' text-secondary', onClick: () => {} }
            },
            {
              text: 'กำหนดวันใช้งาน',
              icon: <EditCalendar />,
              menuItemProps: {
                className: ' text-secondary',
                onClick: () => {
                  showDialog({
                    id: 'alertDateUseFormDialog',
                    component: <DateUseFormDialog id='alertDateUseFormDialog' onClick={() => {}} />,
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
                        title={'ลบฟอร์ม'}
                        content1={`คุณต้องการลบฟอร์มนี้ใช่หรือไม่`}
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
      <Typography className='w-full text-start italic' variant='body2'>
        {version}
      </Typography>
      <Button className='p-0' color='secondary'>
        <img src={image} alt={title} className='w-full h-auto rounded-md' />
      </Button>
      <Typography variant='body2' className='text-end'>
        {date}
      </Typography>
      <div className='flex items-center justify-end gap-1'>
        <Typography variant='body2' className=' text-success'>
          {status}
        </Typography>
        <AccountTreeOutlined className='text-success' />
      </div>
    </div>
  )

  console.log('data', data)

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DashboardNavbarContent />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent className='min-h-[calc(100vh-160px)]'>
            <div className='flex gap-4 flex-wrap'>
              <Button
                className={`w-[200px] h-[262px] rounded-md  flex  items-center justify-center`}
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
                      version={item?.version[0]?.version}
                      data={item}
                      image='/images/test/test01.png'
                      date='แก้ไขล่าสุด 31 ธ.ค. 2567'
                      status={'ใช้งานอยู่'}
                      onDelete={handleDeleteForm}
                    />
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AdminDashboardComponent

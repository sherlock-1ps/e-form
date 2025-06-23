'use client'

import { Grid, Typography, Button, CardContent, Card, CircularProgress, Pagination, IconButton } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import { useDispatch } from 'react-redux'

import Link from '@/components/Link'
import { useParams, useRouter } from 'next/navigation'
import DashboardNavbarContent from '@/components/layout/vertical/navbar/DashboardNavbarContent'
import { useDialog } from '@/hooks/useDialog'
import CreateFormDialog from '@/components/dialogs/form/CreateFormDialog'
import OptionMenu from '@/@core/components/option-menu'
import {
  Edit,
  FileCopy,
  EditCalendar,
  Delete,
  CreateNewFolder,
  AccountTreeOutlined,
  ContentCopy
} from '@mui/icons-material'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const router = useRouter()
  const { lang: locale } = useParams()
  const { showDialog } = useDialog()
  const setFullFlow = useFlowStore(state => state.setFullFlow)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const { data, isPending } = useFetchFlowQueryOption(page, pageSize)

  const { mutateAsync: deleteFlow } = useDeleteFlowQueryOption()

  const { mutateAsync: getFlow, isPending: pendingGetFlow } = useGetFlowQueryOption()
  // const ImageCard = ({ title, image, date, status, version, onDelete, data, onGetForm, viewMode, dateUpdate }: any) => {
  //   const isGrid = viewMode === 'grid'
  //   const OptionMenuCustom = () => {
  //     return (
  //       <OptionMenu
  //         iconButtonProps={{ size: 'small' }}
  //         iconClassName='text-gray-500'
  //         options={[
  //           {
  //             text: 'แก้ไข',
  //             icon: pendingGetFlow ? <CircularProgress size={20} /> : <Edit />,
  //             menuItemProps: {
  //               disabled: pendingGetFlow,
  //               className: 'text-secondary',
  //               onClick: () => onGetForm(data)
  //             }
  //           },
  //           {
  //             text: 'สำเนา',
  //             icon: <ContentCopy />,
  //             menuItemProps: {
  //               className: 'text-secondary',
  //               onClick: () => onGetForm(data, true)
  //             }
  //           },
  //           {
  //             text: 'เวอร์ชั่นใหม่',
  //             icon: <CreateNewFolder />,
  //             menuItemProps: {
  //               className: 'text-secondary',
  //               onClick: () =>
  //                 showDialog({
  //                   id: 'alertEditVersionFlowDialog',
  //                   component: <EditVersionFlowDialog id='alertEditVersionFlowDialog' data={data} onClick={() => {}} />,
  //                   size: 'sm'
  //                 })
  //             }
  //           },
  //           {
  //             text: 'กำหนดวันใช้งาน',
  //             icon: <EditCalendar />,
  //             menuItemProps: {
  //               className: 'text-secondary',
  //               onClick: () =>
  //                 showDialog({
  //                   id: 'alertDateUseFlowDialog',
  //                   component: <DateUseFlowDialog id='alertDateUseFlowDialog' data={data} />,
  //                   size: 'sm'
  //                 })
  //             }
  //           },
  //           {
  //             text: 'ลบ',
  //             icon: <Delete />,
  //             menuItemProps: {
  //               className: 'text-error',
  //               onClick: () =>
  //                 showDialog({
  //                   id: 'alertDeleteForm',
  //                   component: (
  //                     <ConfirmAlert
  //                       id='alertDeleteForm'
  //                       title='ลบโฟลว์'
  //                       content1='คุณต้องการลบโฟลว์นี้ใช่หรือไม่'
  //                       onClick={() => onDelete(data?.id)}
  //                     />
  //                   ),
  //                   size: 'sm'
  //                 })
  //             }
  //           }
  //         ]}
  //       />
  //     )
  //   }
  //   return (
  //     <div
  //       className={
  //         isGrid
  //           ? 'flex flex-col p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl w-[220px] min-h-[275px] border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'
  //           : 'flex flex-row items-start p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl w-full min-h-[70px] border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 gap-4'
  //       }
  //     >
  //       {/* Left section (title and version) */}
  //       <div className={isGrid ? 'flex flex-col w-full' : 'flex flex-col flex-grow'}>
  //         {/* Header: title and OptionMenu */}
  //         <div className={isGrid ? 'flex items-start justify-between' : 'flex items-start w-full'}>
  //           <Typography
  //             variant='h6'
  //             className={`font-semibold leading-snug break-words ${
  //               isGrid ? 'text-start max-w-[150px]' : 'flex-grow text-start'
  //             }`}
  //           >
  //             {title}
  //           </Typography>

  //           <div className={isGrid ? '' : 'ml-auto'}>
  //             <OptionMenuCustom />
  //           </div>
  //         </div>

  //         {/* Version */}
  //         <div className='text-xs text-gray-500 flex justify-between  mt-1'>
  //           <span>เวอร์ชั่น {version}</span>
  //         </div>

  //         {isGrid ? (
  //           <div
  //             className={
  //               'min-h-[100px]  flex-1 my-2 bg-slate-100 rounded-md flex items-center justify-center text-center px-2 py-2 text-sm text-gray-600 '
  //             }
  //           >
  //             <span className='line-clamp-3'>{title}</span>
  //           </div>
  //         ) : null}
  //         {/* Date */}
  //         {/* <Typography variant='caption' className='text-xs text-gray-500 flex justify-between w-full mt-1'>
  //           <span> {date}</span>
  //           <span> {dateUpdate}</span>
  //         </Typography> */}
  //         <Typography variant='caption' className='text-xs text-gray-500 w-full mt-1'>
  //           <span className='block'>{date}</span>
  //           <span className='block'>{dateUpdate}</span>
  //         </Typography>
  //       </div>
  //     </div>
  //   )
  // }

  const ImageCard = ({ title, image, date, dateUpdate, status, version, onDelete, data, onGetForm, viewMode }: any) => {
    const isGrid = viewMode === 'grid'
    const pendingGetForm = false // Replace if you manage this via props or state

    const OptionMenuCustom = () => {
      return (
        <OptionMenu
          iconButtonProps={{ size: 'small' }}
          iconClassName='text-gray-500'
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
              text: 'สำเนา',
              icon: <ContentCopy />,
              menuItemProps: {
                className: 'text-secondary',
                onClick: () => onGetForm(data, true)
              }
            },
            {
              text: 'เวอร์ชั่นใหม่',
              icon: <CreateNewFolder />,
              menuItemProps: {
                className: 'text-secondary',
                onClick: () =>
                  showDialog({
                    id: 'alertEditVersionFlowDialog',
                    component: <EditVersionFlowDialog id='alertEditVersionFlowDialog' data={data} onClick={() => {}} />,
                    size: 'sm'
                  })
              }
            },
            {
              text: 'กำหนดวันใช้งาน',
              icon: <EditCalendar />,
              menuItemProps: {
                className: 'text-secondary',
                onClick: () =>
                  showDialog({
                    id: 'alertDateUseFlowDialog',
                    component: <DateUseFlowDialog id='alertDateUseFlowDialog' data={data} />,
                    size: 'sm'
                  })
              }
            },
            {
              text: 'ลบ',
              icon: <Delete />,
              menuItemProps: {
                className: 'text-error',
                onClick: () =>
                  showDialog({
                    id: 'alertDeleteForm',
                    component: (
                      <ConfirmAlert
                        id='alertDeleteForm'
                        title='ลบโฟลว์'
                        content1='คุณต้องการลบโฟลว์นี้ใช่หรือไม่'
                        onClick={() => onDelete(data?.id)}
                      />
                    ),
                    size: 'sm'
                  })
              }
            }
          ]}
        />
      )
    }

    return (
      <div
        className={
          isGrid
            ? 'flex flex-col p-4 bg-white rounded-2xl w-[240px] min-h-[280px] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300'
            : 'flex flex-row items-start p-4 bg-white rounded-2xl w-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 gap-4'
        }
      >
        {/* Content Container */}
        <div className='flex flex-col flex-grow gap-2 w-full'>
          {/* Header: Title + Menu */}
          <div className='flex items-start justify-between gap-2'>
            <Typography
              variant='h6'
              className='text-base font-semibold text-gray-800 leading-snug truncate max-w-[calc(100%-30px)]'
            >
              {title}
            </Typography>
            <OptionMenuCustom />
          </div>

          {/* Version */}
          <div className='text-xs text-gray-500'>
            <span>
              เวอร์ชั่น <b>{version}</b>
            </span>
          </div>

          {/* Grid Preview */}
          {isGrid && (
            <div className='flex-1 my-2 bg-slate-100 rounded-md flex items-center justify-center text-center px-3 py-2 text-sm text-gray-600'>
              <span className='line-clamp-3'>{title}</span>
            </div>
          )}

          {/* Date Section */}
          <div className='flex flex-col text-xs text-gray-500 leading-relaxed'>
            <span>สร้างเมื่อ: {date}</span>
            <span>แก้ไขล่าสุด: {dateUpdate}</span>
          </div>
        </div>
      </div>
    )
  }

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

  const handleGetForm = async (data: any, isCopy: boolean = false) => {
    try {
      const response = await getFlow(data?.version?.[0]?.id)

      if (response?.code == 'SUCCESS') {
        const contentCopy = isCopy
          ? {
              flowId: undefined,
              versionId: undefined,
              version: '1.0.0',
              name: `สำเนา_${data?.name}`,
              isContinue: false
            }
          : {}

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
          },
          ...contentCopy
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
            {/* <Typography variant='h5'>จัดการเวิร์กโฟลว์</Typography> */}
            <Grid item xs={12} className='flex items-center justify-between'>
              <Typography variant='h4'>จัดการเวิร์กโฟลว์</Typography>
              <div className='flex gap-2  backdrop-blur-sm p-2 rounded-xl shadow-sm  items-center'>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  className='transition-all duration-200'
                >
                  <i className='tabler tabler-layout-grid text-xl' />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  className='transition-all duration-200'
                >
                  <i className='tabler tabler-list text-xl' />
                </IconButton>
              </div>
            </Grid>

            <div className='flex gap-4 flex-wrap'>
              {/* <Button
                className={`w-[200px] min-h-[262px] rounded-md  flex  items-center justify-center`}
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
              </Button> */}

              <Button
                className={`rounded-md flex items-center justify-center transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'w-[200px] min-h-[262px] flex-col' // grid: square-like
                    : 'w-full min-h-[80px] flex-row gap-2 px-4' // list: full width, shorter height
                }`}
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
                {viewMode === 'list' && <span className='text-[#0463EA] font-medium'>สร้างโฟลว์ใหม่</span>}
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
                      date={`${formatThaiDate(item?.created_at)}`}
                      dateUpdate={`${formatThaiDate(item?.updated_at)}`}
                      status={'ใช้งานอยู่'}
                      onDelete={handleDeleteFlow}
                      onGetForm={handleGetForm}
                      viewMode={viewMode}
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

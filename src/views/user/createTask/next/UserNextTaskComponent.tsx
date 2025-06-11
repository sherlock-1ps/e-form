/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// MUI Imports
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import {
  ChevronLeft,
  Start,
  AttachFile,
  EditNote,
  Draw,
  History,
  Check,
  AccountTree,
  FileOpen
} from '@mui/icons-material'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StepperWrapper from '@/@core/styles/stepper'
import classNames from 'classnames'
import StepperCustomDot from '@/components/stepper-dot'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import NormalSignDialog from '@/components/dialogs/sign/NormalSignDialog'
import ElectonicSignDialog from '@/components/dialogs/sign/ElectonicSignDialog'
import CertifySignDialog from '@/components/dialogs/sign/CertifySignDialog'
import OtpSignDialog from '@/components/dialogs/sign/OtpSignDialog'
import FlowDocTable from '../../followTask/FlowDocTable'
import { useFormStore } from '@/store/useFormStore'
import ViewWorkflowComponent from '../ViewWorkflowComponent'
import {
  useDeleteAttachments,
  useFetchAttachmentsQueryOption,
  useFetchCommentQueryOption,
  useSaveStartFlowQueryOption,
  useUploadAttachments
} from '@/queryOptions/form/formQueryOptions'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import DraftFormComponent from '@/views/draftform/DraftFormComponent'
import { mapKeyValueForm } from '@/utils/mapKeyValueForm'
import FlowDocFullTable from '../../followTask/FlowDocFullTable'
import ViewFlowComponent from '@/views/workflow/ViewFlowComponent'
import CommentSignDialog from '@/components/dialogs/sign/CommentSignDialog'
import { useWatchFormStore } from '@/store/useFormScreenEndUserStore'

const allowedExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.avi',
  '.mp4',
  '.mov',
  '.pdf',
  '.doc',
  '.docx',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.csv'
]

const UserNextTaskComponent = ({ data, isView = true }: any) => {
  const setWatchFormFalse = useWatchFormStore(state => state.setWatchFormFalse)
  const setWatchFormTrue = useWatchFormStore(state => state.setWatchFormTrue)
  const form = useFormStore(state => state.form)
  const router = useRouter()
  const { showDialog } = useDialog()
  const params = useParams()
  const { lang: locale } = params
  const [collapsed, setCollapsed] = useState(false)
  const [isAttacth, setIsAttacth] = useState(false)
  const [isStartSign, setIsStartSign] = useState(false)
  const [linkIdButton, setLinkIdButton] = useState(null)
  const [isShowHistoryComment, setIsShowHistoryComment] = useState(false)
  const [isAlreadySign, setIsAlreadySign] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isShowWorkflow, setIsShowWorkFlow] = useState(false)
  const [startStep, setStartStep] = useState<any[]>([])
  const formDataId = data?.form_data_id ?? data?.form_data_detail[0]?.form_data_id
  const { data: attactmentData } = useFetchAttachmentsQueryOption(formDataId)
  const { mutateAsync: callUploadAttachment, isPending } = useUploadAttachments()
  const { mutateAsync: callDeleteAttachment } = useDeleteAttachments()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const { data: commentData } = useFetchCommentQueryOption(page, pageSize, formDataId)
  const { mutateAsync: callSaveStartflow } = useSaveStartFlowQueryOption()

  useEffect(() => {
    const completedFlow = data?.form_data_detail ?? []
    const currentFlow = data?.flow_activity_link ?? []
    const nodeData = data?.flow?.nodeDataArray ?? []

    const completedKeys = completedFlow.map((flow: any) => flow.link_from)
    const nodeOld = completedKeys
      .map((key: any) => {
        const node = nodeData.find((node: any) => node.key === key)
        const flow = completedFlow.find((flow: any) => flow.link_from === key)
        return node && flow ? { ...node, action: flow.text } : null
      })
      .filter(Boolean)

    const currentKeys = currentFlow.map((flow: any) => flow.link_from)
    let currentNode = currentKeys
      .map((key: any) => {
        const node = nodeData.find((node: any) => node.key === key)
        const flow = currentFlow.find((flow: any) => flow.link_from === key)
        return node && flow ? { ...node, action: flow.text } : null
      })
      .filter(Boolean)

    if (currentNode.length > 1) {
      const [first, ...rest] = currentNode
      currentNode = [
        {
          ...first,
          children: rest
        }
      ]
    }

    const result = [...nodeOld, ...currentNode]

    setStartStep(result)
    setWatchFormTrue()
  }, [])

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isTooLarge = file.size > Number(process.env.NEXT_PUBLIC_MAX_FILE_IMAGE_SIZE_MB) * 1024 * 1024
      const isInvalidExt = !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

      if (isTooLarge) {
        toast.error('ไฟล์มีขนาดเกิน 20MB และไม่สามารถอัปโหลดได้', { autoClose: 3000 })
        return
      }

      if (isInvalidExt) {
        toast.error('พบไฟล์ที่ไม่รองรับรูปแบบ', { autoClose: 3000 })
        return
      }

      const response = await handleUpdateAttachment(file)

      if (response?.code === 'SUCCESS') {
        toast.success('อัพโหลดไฟล์สำเร็จ', { autoClose: 3000 })
      }

      e.target.value = ''
    }
  }

  const handleUpdateAttachment = async (file: any) => {
    try {
      const response = await callUploadAttachment({ file, form_data_id: data?.form_data_id })
      return response
    } catch (error) {
      toast.error('อัพโหลดไฟล์ล้มเหลว', { autoClose: 3000 })
    }
  }

  const handleRemoveImage = async (id: any) => {
    try {
      const response = await callDeleteAttachment({ id })
      if (response?.code == 'SUCCESS') {
        toast.success('ลบไฟล์สำเร็จ', { autoClose: 3000 })
      }
    } catch (error) {
      toast.error('ลบไฟล์ล้มเหลว', { autoClose: 3000 })
    }
  }

  const handleSaveStartflow = async (comment: string, linkId?: any) => {
    try {
      const resultMapValue = mapKeyValueForm(form?.form_details)

      const request = {
        id: data?.form_data_id, // มี FormData id ตลอดแล้วว
        // "form_data_detail_id": 22, // ตอนมี id
        flow_activity_link_id: linkIdButton || linkId,
        form_version_id: data?.form_detail?.form_version_id, //กรณีตรงนี้ คือ เขาจะส่งform ต่อไปที่เชื่อมมาหรือ
        is_sign: false,
        // "sign_date": "2025-12-31T23:59:59Z", // false ไม่ส่ง
        // "sign": { // false ไม่ส่ง
        //     "data": "xxx"
        // },
        data_detail: resultMapValue,
        comment: comment ?? ''
      }
      const response = await callSaveStartflow(request)

      return response
    } catch (error) {
      toast.error('ไม่สามารถบันทึกได้', { autoClose: 3000 })
    }
  }

  const handleEditPdf = async (item: any) => {
    const innerUrl = `${process.env.NEXT_PUBLIC_VIEW_PDF_URL}?form_data_id=${item?.form_data_id}&attachment_id=${item?.id}&file=${item?.url_file_download}`
    const encodedUrl = encodeURIComponent(innerUrl)

    window.open(`/${locale}/user/viewPdf?url=${encodedUrl}`, '_blank')
  }

  const handleBackShowFlow = () => {
    setIsShowWorkFlow(!isShowWorkflow)
  }

  return (
    <div className='flex flex-col md:flex-row  gap-4 w-full min-h-[calc(100vh-3rem)] relative'>
      <div
        className={`transition-all duration-75 z-20 ${collapsed ? 'w-[60px] min-w-[60px]' : 'w-[300px] min-w-[300px]'}`}
      >
        {collapsed ? (
          <div className='flex items-center justify-center  p-2 rounded-sm'>
            <div className='flex  items-center gap-2  bg-primary rounded-lg'>
              <IconButton className='w-[60px]' onClick={() => setCollapsed(!collapsed)}>
                {/* <ChevronRight /> */}
                <Typography variant='body2' className=' text-white'>
                  ดูโฟล์ว
                </Typography>
              </IconButton>
            </div>
          </div>
        ) : (
          <Card className=' shadow-2xl'>
            <CardContent className='flex flex-col overflow-auto max-h-[calc(100vh-3rem)]'>
              <div className='flex justify-between items-center'>
                <Typography variant='h6'>การทำงาน</Typography>
                <IconButton className='w-[40px]' onClick={() => setCollapsed(!collapsed)}>
                  <ChevronLeft />
                </IconButton>
              </div>
              <StepperWrapper>
                <Stepper
                  activeStep={startStep?.find(item => item.category == 'end') ? startStep.length : startStep.length - 1}
                  orientation='vertical'
                >
                  {startStep.map((step, index) => (
                    <Step key={index} className={classNames({})}>
                      <StepLabel StepIconComponent={iconProps => <StepperCustomDot {...iconProps} />}>
                        <div className='step-label'>
                          <div>
                            <Typography className='step-title'>{step?.text ?? ''}</Typography>
                            <Typography className='step-subtitle'>{step?.action}</Typography>
                          </div>
                        </div>

                        {step?.children?.length > 0 &&
                          step.children?.map((data: any, index: number) => {
                            return (
                              <div className='step-label flex flex-col items-start' key={index}>
                                <Typography className='self-center' variant='body2'>
                                  หรือ
                                </Typography>
                                <Typography className='step-title'>{data?.text ?? ''}</Typography>
                                <Typography className='step-subtitle'>{step?.action}</Typography>
                              </div>
                            )
                          })}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </StepperWrapper>
              {isShowWorkflow ? (
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  className='my-2'
                  startIcon={<FileOpen />}
                  onClick={() => {
                    setWatchFormTrue()
                    setIsShowWorkFlow(!isShowWorkflow)
                  }}
                >
                  กลับสู่ Form
                </Button>
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  className='my-2'
                  startIcon={<AccountTree />}
                  onClick={() => {
                    setWatchFormFalse()
                    setIsShowWorkFlow(!isShowWorkflow)
                  }}
                >
                  ดูแบบเวิร์กโฟลว์
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {isShowWorkflow ? (
        <div className='flex flex-1 w-full h-full  md:absolute md:top-0 md:left-0'>
          {/* <ViewWorkflowComponent onBack={false} /> */}

          <ViewFlowComponent formDataId={formDataId} onBack={handleBackShowFlow} noBack={true} />
        </div>
      ) : (
        <>
          <div className=' w-full min-h-screen mb-[460px] z-30'>
            <div className='flex flex-1 items-center justify-center'>
              <DraftFormComponent />
            </div>
            <div className='fixed bottom-4 max-w-[100vw] md:max-w-[calc(62vw)] w-full  right-0  md:right-6'>
              {!isExpanded ? (
                <div className='w-full flex items-end justify-end'>
                  <div className=' '>
                    <Button
                      variant='contained'
                      color='inherit'
                      onClick={() => {
                        setIsExpanded(true)
                      }}
                    >
                      ขยาย
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className='h-full shadow-xl relative '>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={4}>
                        <Typography variant='h5' className='text-nowrap'>
                          การลงนามและการเดินหนังสือ
                        </Typography>
                      </Grid>
                      <Grid item xs className='flex flex-col md:flex-row justify-end gap-2'>
                        <Button
                          variant='outlined'
                          startIcon={<AttachFile />}
                          onClick={() => {
                            setIsAttacth(!isAttacth)
                          }}
                        >
                          จัดการไฟล์แนบ
                        </Button>
                        <Button
                          variant='outlined'
                          startIcon={<History />}
                          onClick={() => {
                            setIsShowHistoryComment(true)
                          }}
                        >
                          ดูประวัติการดำเนินการทั้งหมด
                        </Button>
                        <Button
                          className='max-w-[150px] self-end'
                          variant='contained'
                          color='secondary'
                          onClick={() => {
                            setIsExpanded(false)
                          }}
                        >
                          ซ่อน
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <FlowDocTable data={(commentData?.result?.data || []).slice(0, 3)} />
                      </Grid>
                      <Grid item xs={12} className='flex items-center justify-end gap-2 '>
                        <div className='flex gap-2 items-center overflow-auto flex-nowrap min-w-0 pb-2'>
                          {!isView ? (
                            isStartSign ? (
                              <div className='flex gap-2 items-center min-w-max'>
                                <Button
                                  variant='contained'
                                  color='inherit'
                                  onClick={() => {
                                    setIsStartSign(false)
                                  }}
                                  className=' self-start'
                                >
                                  กลับ
                                </Button>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  startIcon={<Draw />}
                                  onClick={() => {
                                    showDialog({
                                      id: 'alertSignDialog',
                                      component: <NormalSignDialog id='alertSignDialog' onSave={handleSaveStartflow} />,
                                      size: 'sm'
                                    })
                                  }}
                                >
                                  ลงนาม
                                </Button>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  startIcon={<Draw />}
                                  onClick={() => {
                                    showDialog({
                                      id: 'alertSignElectonicSignDialog',
                                      component: (
                                        <ElectonicSignDialog
                                          id='alertSignElectonicSignDialog'
                                          onSave={handleSaveStartflow}
                                        />
                                      ),
                                      size: 'sm'
                                    })
                                  }}
                                >
                                  ลงนาม - ลายมือชื่ออิเล็กทรอนิกส์ (ม.9)
                                </Button>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  startIcon={<Draw />}
                                  onClick={() => {
                                    showDialog({
                                      id: 'alertCertifySignDialog',
                                      component: (
                                        <CertifySignDialog id='alertCertifySignDialog' onSave={handleSaveStartflow} />
                                      ),
                                      size: 'sm'
                                    })
                                  }}
                                >
                                  ลงนาม (ใบรับรองอิเล็กทรอนิกส์)
                                </Button>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  startIcon={<Draw />}
                                  onClick={() => {
                                    showDialog({
                                      id: 'alertSignOtpSignDialog',
                                      component: (
                                        <OtpSignDialog id='alertSignOtpSignDialog' onSave={handleSaveStartflow} />
                                      ),
                                      size: 'sm'
                                    })
                                  }}
                                >
                                  ลงนาม OTP
                                </Button>
                              </div>
                            ) : (
                              <div className='flex justify-end flex-nowrap min-w-max gap-2'>
                                {data?.flow_activity_link?.map((item: any, index: number) => {
                                  return (
                                    <Button
                                      key={index}
                                      variant='contained'
                                      onClick={() => {
                                        if (item?.signId) {
                                          setLinkIdButton(item?.link_id)
                                          setIsStartSign(true)
                                        } else {
                                          showDialog({
                                            id: 'alertCommentSignDialog',
                                            component: (
                                              <CommentSignDialog
                                                id='alertCommentSignDialog'
                                                onSave={handleSaveStartflow}
                                                flowId={item?.link_id}
                                                title={item?.text}
                                              />
                                            ),
                                            size: 'sm'
                                          })
                                        }
                                      }}
                                    >
                                      {item?.text}
                                    </Button>
                                  )
                                })}
                              </div>
                            )
                          ) : null}
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {isAttacth && (
            <div className=' fixed top-0 bottom-0 left-0 right-0 bg-slate-400 bg-opacity-50  z-40 flex items-end justify-end'>
              <div className='w-[800px] h-screen bg-slate-100 flex flex-col gap-2 justify-between pb-8'>
                <div className=' overflow-auto'>
                  <div className='flex items-center justify-between p-6 bg-white'>
                    <div className='flex flex-col gap-2'>
                      <Typography variant='h5'>จัดการไฟล์แนบ</Typography>
                      <Typography variant='body2' className=' text-primary'>
                        {form?.name}
                      </Typography>
                    </div>

                    <IconButton
                      size='small'
                      onClick={() => {
                        setIsAttacth(false)
                      }}
                    >
                      <i className='tabler-x text-2xl text-actionActive' />
                    </IconButton>
                  </div>
                  <div className='flex flex-wrap gap-4 p-6'>
                    {attactmentData?.result?.data?.attachments.length > 0 &&
                      attactmentData?.result?.data?.attachments?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className='relative w-[240px] h-[140px] flex flex-col items-center border rounded-md overflow-hidden'
                        >
                          <div className='relative w-full h-[120px]'>
                            <img
                              src={item?.url_file_download || item?.url_thumbnail_download}
                              className='w-full h-full object-cover'
                              alt='preview'
                            />
                            <IconButton
                              size='small'
                              className='absolute top-0 right-0 bg-white'
                              onClick={() => {
                                showDialog({
                                  id: 'alertDeleteApiCall',
                                  component: (
                                    <ConfirmAlert
                                      id='alertDeleteApiCall'
                                      title={'ลบไฟล์แนบ'}
                                      content1={'คุณต้องการลบไฟล์แนบนี้ใช่หรือไม่'}
                                      onClick={() => {
                                        handleRemoveImage(item?.id)
                                      }}
                                    />
                                  ),
                                  size: 'sm'
                                })
                              }}
                            >
                              <i className='tabler-x text-sm text-red-500' />
                            </IconButton>
                            <div className='absolute top-0 left-0 bg-white w-5 flex items-center justify-center'>
                              <Typography variant='h6'>{index + 1}</Typography>
                            </div>
                          </div>
                          {item?.attachment_type.includes('pdf') && (
                            <Button
                              variant='contained'
                              onClick={() => {
                                handleEditPdf(item)
                              }}
                            >
                              Edit PDF
                            </Button>
                          )}
                          <div className='w-full'>
                            <Typography className='text-xs break-words leading-snug'>{item?.name}</Typography>
                          </div>
                        </div>
                      ))}
                    {/* {images.map((img, index) => (
                      <div
                        key={index}
                        className='relative w-[240px] h-[140px] flex flex-col items-center border rounded-md overflow-hidden'
                      >
                        <div className='relative w-full h-[120px]'>
                          <img src={URL.createObjectURL(img)} className='w-full h-full object-cover' alt='preview' />
                          <IconButton
                            size='small'
                            className='absolute top-0 right-0 bg-white'
                            onClick={() => handleRemoveImage(index)}
                          >
                            <i className='tabler-x text-sm text-red-500' />
                          </IconButton>
                          <div className='absolute top-0 left-0 bg-white w-5 flex items-center justify-center'>
                            <Typography variant='h6'>{index + 1}</Typography>
                          </div>
                        </div>
                        <div className='w-full'>
                          <Typography className='text-xs break-words leading-snug'>{img.name}</Typography>
                        </div>
                      </div>
                    ))} */}
                  </div>
                </div>

                <div className='w-full flex items-center justify-center'>
                  <Button variant='contained' component='label' color='primary' disabled={isPending}>
                    เพิ่มไฟล์ใหม่
                    <input
                      type='file'
                      hidden
                      accept={`
      .jpg,.jpeg,.png,.gif,.webp,.bmp,
      .avi,.mp4,.mov,
      .pdf,.doc,.docx,.xlsx,.ppt,.pptx,.csv
    `}
                      onChange={handleAddImage}
                    />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isShowHistoryComment && (
            <div className=' fixed top-0 bottom-0 left-0 right-0 bg-slate-400 bg-opacity-50  z-40 flex items-end justify-end'>
              <div className='w-[800px] h-screen bg-slate-100 flex flex-col gap-2 justify-between pb-8'>
                <div className=' overflow-auto'>
                  <div className='flex items-center justify-between p-6 bg-white'>
                    <div className='flex flex-col gap-2'>
                      <Typography variant='h5'>ประวัติการดำเนินการทั้งหมด</Typography>
                      {/* <Typography variant='body2' className=' text-primary'>
                        {form?.name}
                      </Typography> */}
                    </div>

                    <IconButton
                      size='small'
                      onClick={() => {
                        setIsShowHistoryComment(false)
                      }}
                    >
                      <i className='tabler-x text-2xl text-actionActive' />
                    </IconButton>
                  </div>
                  <div className='w-full p-6'>
                    <FlowDocFullTable
                      data={commentData?.result?.data || []}
                      page={page}
                      pageSize={pageSize}
                      setPage={setPage}
                      setPageSize={setPageSize}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserNextTaskComponent

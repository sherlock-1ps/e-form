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
import React, { useState } from 'react'
import StepperWrapper from '@/@core/styles/stepper'
import classNames from 'classnames'
import StepperCustomDot from '@/components/stepper-dot'
import CustomTextField from '@/@core/components/mui/TextField'
import FlowDocTable from './FlowDocTable'
import { useDialog } from '@/hooks/useDialog'
import NormalSignDialog from '@/components/dialogs/sign/NormalSignDialog'
import ElectonicSignDialog from '@/components/dialogs/sign/ElectonicSignDialog'
import CertifySignDialog from '@/components/dialogs/sign/CertifySignDialog'
import OtpSignDialog from '@/components/dialogs/sign/OtpSignDialog'

const steps = {
  currentFlow: 3,
  list: [
    {
      title: 'ขออนุมัติเบิกค่าเช่าบ้าน (6005)',
      subtitle: 'Username, 31 ม.ค. 2568 12:34',
      status: 'completed'
    },
    {
      title: 'กรอกแบบฟอร์มและบันทึกเข้าระบบ',
      subtitle: 'กำลังดำเนินการ',
      status: 'active'
    },
    {
      title: 'ผอ. สำนักฯ พิจารณาอนุมัติ',
      status: 'pending'
    },
    {
      title: 'จนท. คลัง ตรวจสอบเอกสาร',
      status: 'pending'
    },
    {
      title: 'ผอ. คลัง พิจารณาอนุมัติ',
      status: 'pending'
    },
    {
      title: 'กรรมการที่ 1 ตรวจสอบอนุมัติ',
      status: 'pending'
    },
    {
      title: 'กรรมการที่ 2 ตรวจสอบอนุมัติ',
      status: 'pending'
    },
    {
      title: 'กรรมการที่ 3 ตรวจสอบอนุมัติ',
      status: 'pending'
    },
    {
      title: 'แจ้งผลการขออนุมัติ',
      status: 'pending'
    },
    {
      title: 'เสร็จสิ้น',
      status: 'pending'
    }
  ]
}

const mockupData = [
  {
    operator: 'สมชาย ใจดี',
    department: 'ฝ่ายบุคคล',
    timestamp: '30 เม.ย. 2568 10:15',
    comment: 'เห็นควรอนุมัติ',
    status: 'ร่างและเสนอ'
  },
  {
    operator: 'วิภา พิพัฒน์',
    department: 'การเงิน',
    timestamp: '30 เม.ย. 2568 11:00',
    comment: 'รอเอกสารเพิ่มเติม',
    status: 'รอลงนาม'
  },
  {
    operator: 'มนตรี ขยันดี',
    department: 'ตรวจสอบภายใน',
    timestamp: '29 เม.ย. 2568 16:45',
    comment: 'เอกสารถูกต้อง',
    status: 'รอลงนาม'
  }
]

const UserFollowTaskComponent = () => {
  const router = useRouter()
  const { showDialog } = useDialog()
  const params = useParams()
  const { lang: locale } = params
  const [collapsed, setCollapsed] = useState(false)
  const [activeStep, setActiveStep] = useState(steps.currentFlow)
  const [isAttacth, setIsAttacth] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [isStartSign, setIsStartSign] = useState(false)
  const [isAlreadySign, setIsAlreadySign] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isShowWorkflow, setIsShowWorkFlow] = useState(false)

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setImages(prev => [...prev, ...Array.from(files)])
      e.target.value = '' // reset input
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='flex gap-4 w-full min-h-[calc(100vh-3rem)]'>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          collapsed ? 'w-[60px] min-w-[60px]' : 'w-[300px] min-w-[300px]'
        }`}
      >
        {collapsed ? (
          <div className='flex items-center justify-center bg-white p-2 rounded-sm'>
            <div className='flex  items-center gap-2'>
              <IconButton className='w-[60px]' onClick={() => setCollapsed(!collapsed)}>
                {/* <ChevronRight /> */}
                <Typography variant='body2' className=' text-textPrimary'>
                  ดูโฟล์ว
                </Typography>
              </IconButton>
            </div>
          </div>
        ) : (
          <Card className=''>
            <CardContent className='flex flex-col overflow-auto max-h-[calc(100vh-3rem)]'>
              <div className='flex justify-between items-center'>
                <Typography variant='h6'>การทำงาน</Typography>
                <IconButton className='w-[40px]' onClick={() => setCollapsed(!collapsed)}>
                  <ChevronLeft />
                </IconButton>
              </div>
              <StepperWrapper>
                <Stepper activeStep={activeStep} orientation='vertical'>
                  {steps?.list.map((step, index) => (
                    <Step key={index} className={classNames({ active: activeStep === index })}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                            <Typography className='step-subtitle'>{step.subtitle}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                      {/* <StepContent>
                        <Typography>{step.description}</Typography>
                      </StepContent> */}
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
        <div className='flex flex-1 min-h-[calc(100vh-3rem)] rounded-md overflow-hidden'>
          <iframe
            src='https://e-form-iota.vercel.app/flow/index.html'
            className='w-full h-full border-0'
            title='Wikipedia'
          ></iframe>
        </div>
      ) : (
        <>
          <div className=' w-full min-h-screen pb-[210px]'>
            <div className='min-w-[794px] w-[794px] mx-auto bg-white rounded-md min-h-[1123px]'></div>
            <div className='fixed bottom-4 max-w-[calc(62vw)] w-full  right-6 '>
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
                <Card className='h-full shadow-lg relative'>
                  <CardContent>
                    {!isStartSign && (
                      <Button
                        className=' absolute top-4 right-4 w-6 '
                        onClick={() => {
                          setIsExpanded(false)
                        }}
                      >
                        ซ่อน
                      </Button>
                    )}

                    {isStartSign ? (
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant='h6'>การลงนามและการเดินหนังสือ</Typography>
                        </Grid>
                        <Grid item xs={6} className='flex justify-end'>
                          <Button variant='outlined' startIcon={<History />} onClick={() => {}}>
                            ดูประวัติการดำเนินการทั้งหมด
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <FlowDocTable data={mockupData} />
                        </Grid>
                        <Grid item xs={12} className='flex items-center justify-between gap-1'>
                          <Button
                            variant='contained'
                            color='inherit'
                            onClick={() => {
                              setIsStartSign(false)
                            }}
                          >
                            <i className='tabler-x text-md text-actionActive' />
                            ปิด
                          </Button>
                          <div className='flex gap-2 items-center overflow-auto flex-nowrap min-w-0'>
                            {isAlreadySign ? (
                              <Button
                                variant='contained'
                                color='success'
                                startIcon={<Check />}
                                onClick={() => {
                                  setIsStartSign(false), setIsAlreadySign(false)
                                }}
                              >
                                ลงนามแล้ว
                              </Button>
                            ) : (
                              <div className='flex gap-2 items-center min-w-max'>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  startIcon={<Draw />}
                                  onClick={() => {
                                    showDialog({
                                      id: 'alertSignDialog',
                                      component: <NormalSignDialog id='alertSignDialog' onClick={() => {}} />,
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
                                        <ElectonicSignDialog id='alertSignElectonicSignDialog' onClick={() => {}} />
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
                                      component: <CertifySignDialog id='alertCertifySignDialog' onClick={() => {}} />,
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
                                      component: <OtpSignDialog id='alertSignOtpSignDialog' onClick={() => {}} />,
                                      size: 'sm'
                                    })
                                  }}
                                >
                                  ลงนาม OTP
                                </Button>
                              </div>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    ) : (
                      <div>
                        <div className='flex gap-2 items-center'>
                          <Typography variant='h6'>คุณกำลังอยู่ในขั้นตอนการบันทึกงานเข้าระบบ</Typography>
                          <Typography variant='body2' className=' text-primary'>
                            “ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31 1”
                          </Typography>
                        </div>
                        <Divider className='my-2' />
                        <Grid container>
                          <Grid item xs={6} spacing={4}>
                            <CustomTextField
                              fullWidth
                              label='กำหนดชื่องาน'
                              placeholder='ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31 1'
                              type={'text'}
                            />
                          </Grid>
                          <Grid item xs={6} className='flex items-end justify-end'>
                            <Button
                              variant='outlined'
                              startIcon={<AttachFile />}
                              onClick={() => {
                                setIsAttacth(!isAttacth)
                              }}
                            >
                              จัดการไฟล์แนบ
                            </Button>
                          </Grid>
                          <Grid item xs={12} className='mt-2 '>
                            <div className='w-full overflow-auto py-1'>
                              <div className='flex justify-end flex-nowrap min-w-max gap-2'>
                                <Button variant='contained' color='inherit' startIcon={<EditNote />}>
                                  บันทึกเป็นแบบร่าง
                                </Button>
                                <Button
                                  variant='contained'
                                  startIcon={<Start />}
                                  onClick={() => {
                                    setIsStartSign(true)
                                  }}
                                >
                                  ลงนามและเริ่มงาน
                                </Button>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    )}
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
                        “ขออนุมัติค่าเช่าบ้าน (6005) 2568-01-31 1”
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
                    {images.map((img, index) => (
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
                        <Typography className='truncate text-xs ' title={img.name}>
                          {img.name}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='w-full flex items-center justify-center'>
                  <Button variant='contained' component='label' color='primary'>
                    เพิ่มไฟล์ใหม่
                    <input type='file' hidden accept='image/*' multiple onChange={handleAddImage} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserFollowTaskComponent

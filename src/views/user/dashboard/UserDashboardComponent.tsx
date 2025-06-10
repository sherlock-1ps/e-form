/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem, Tab } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import type { SyntheticEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchProviders } from '@/app/sevices/provider/provider'
import fetchProviderQueryOption, { fetchProviderTypeQueryOption } from '@/queryOptions/provider/providerQueryOptions'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { DoneAll, PendingActions } from '@mui/icons-material'
import EditorForm from '@/components/e-form/newDefault/EditorForm'
import {
  useFetchFlowNnameQueryOption,
  useFetchWorkMyQueryOption,
  useNextFlowQueryOption,
  useStartFlowQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { toast } from 'react-toastify'
import { useFlowStore } from '@/store/useFlowStore'
import { useFormStore } from '@/store/useFormStore'
import UserStartTaskComponent from '../createTask/start/UserStartTaskComponent'
import { applyKeyValueToForm, updateFormValueByKey, updateSignature } from '@/utils/mapKeyValueForm'
import UserDashboardTable from './UserDashboardTable'
import UserNextTaskComponent from '../createTask/next/UserNextTaskComponent'
import ViewFlowComponent from '@/views/workflow/ViewFlowComponent'

const UserDashboardComponent = () => {
  const router = useRouter()
  const params = useParams()
  const setFlowDiagramData = useFlowStore(state => state.setFlowDiagramData)
  const setFullForm = useFormStore(state => state.setFullForm)
  const { lang: locale } = params
  const [value, setValue] = useState<string>('1')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(0)
  const [dataNextFlow, setDataNextFlow] = useState({})
  const [viewFlowId, setViewFlowId] = useState<number | null>(null)

  const { data: flowData } = useFetchFlowNnameQueryOption(1, 999)
  const { data: workMyData } = useFetchWorkMyQueryOption(page, pageSize, Number(selectedWorkflow))

  const { mutateAsync: callNextFlow } = useNextFlowQueryOption()
  const { mutateAsync: callStartFlow } = useStartFlowQueryOption()

  const handleClickManange = async (id: number, status: any, flowId?: any) => {
    try {
      let response
      if (status == 'draft') {
        response = await callStartFlow({ id: flowId })
      } else {
        response = await callNextFlow({ form_data_id: id })
      }
      if (response?.code == 'SUCCESS') {
        let updateForm = response?.result?.data?.form_detail?.detail?.data
        const resultFlow = {
          flow: {
            ...response?.result?.data?.flow
          }
        }

        const detailMerge = response?.result?.data?.current_data_detail_merge
        if (detailMerge?.data_detail) {
          // updateForm = updateFormValueByKey(response?.result?.data?.form_detail?.detail?.data, detailMerge?.data_detail)
          updateForm = applyKeyValueToForm(response?.result?.data?.form_detail?.detail?.data, detailMerge?.data_detail)
        }

        if (detailMerge?.signature) {
          updateForm = updateSignature(updateForm, detailMerge?.signature)
        }

        const layoutValue =
          response?.result?.data?.form_detail?.detail?.layout === 'horizontal' ? 'horizontal' : 'vertical'

        const formFromApi = {
          isContinue: true,
          name: response?.result?.data?.form_detail?.name ?? '-',
          formId: response?.result?.data?.form_detail?.id,
          versionId: response?.result?.data?.form_detail?.form_version_id,
          layout: layoutValue as 'vertical' | 'horizontal',
          form_details: updateForm
        }

        setFlowDiagramData(resultFlow)
        setFullForm(formFromApi)
        setDataNextFlow(response?.result?.data)

        setTimeout(() => {
          if (status == 'draft') {
            setCurrentSection('startFlow')
          } else {
            setCurrentSection('nextFlow')
          }
        }, 150)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('ไม่สามารถเรียก flow ได้', { autoClose: 3000 })
    }
  }

  const handleShowFlow = async (id: number) => {
    // window.open(`/${locale}/workflow/viewflow?form_data_id=${id}`, '_blank')
    setViewFlowId(id)
    setCurrentSection('watchFlow')
  }

  const handleBackShowFlow = () => {
    setCurrentSection('dashboard')
  }

  if (currentSection === 'watchFlow' && viewFlowId !== null) {
    return <ViewFlowComponent formDataId={viewFlowId} onBack={handleBackShowFlow} />
  }

  if (currentSection === 'startFlow') return <UserStartTaskComponent data={dataNextFlow} />
  if (currentSection === 'nextFlow') return <UserNextTaskComponent data={dataNextFlow} />

  return (
    <TabContext value={value}>
      <div className='flex flex-col gap-6'>
        {/* <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                  <Tab
                    value='1'
                    label='งานที่อยู่ระหว่างดำเนินการ'
                    icon={<PendingActions />}
                    iconPosition={'start'}
                    className={value === '1' ? 'bg-primaryLighter' : ''}
                  />
                  <Tab
                    value='2'
                    label='งานที่จบแล้ว'
                    icon={<DoneAll />}
                    iconPosition={'start'}
                    className={value === '2' ? 'bg-primaryLighter' : ''}
                  />
                </TabList>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
        <Card>
          <CardContent>
            <TabPanel value='1'>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant='h5'>งานของฉัน</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    select
                    fullWidth
                    label='เลือกเวิร์คโฟลว์'
                    value={selectedWorkflow}
                    onChange={e => setSelectedWorkflow(e.target.value)}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value={0} disabled>
                      <em className='opacity-50'>เลือกเวิร์คโฟลว์</em>
                    </MenuItem>

                    {flowData?.result?.data?.map((item: any) => (
                      <MenuItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <UserDashboardTable
                    projectTable={workMyData?.result?.data || []}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    count={workMyData?.result?.total}
                    onManage={handleClickManange}
                    onViewFlow={handleShowFlow}
                  />
                </Grid>
                <Divider />
              </Grid>
            </TabPanel>
            {/* <TabPanel value='2'>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='เลือกเวิร์คโฟลว์'
                    SelectProps={{
                      displayEmpty: true
                    }}
                  >
                    <MenuItem value='' disabled>
                      <em className=' opacity-50'>เลือกเวิร์คโฟลว์</em>
                    </MenuItem>
                    <MenuItem value={10}>ขอเบิกเงินค่าเช่า (6006)</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <UserDashboardTable
                    projectTable={workPregressData?.result || []}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                  />
                </Grid>
                <Divider />
              </Grid>
            </TabPanel> */}
          </CardContent>
        </Card>
      </div>
    </TabContext>
  )
}

export default UserDashboardComponent

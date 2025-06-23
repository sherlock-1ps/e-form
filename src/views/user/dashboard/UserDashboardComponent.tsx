/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem, Tab } from '@mui/material'
import { InsertDriveFileOutlined, Task, PushPin, ViewList, AssignmentTurnedIn, Add } from '@mui/icons-material'

import type { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import type { SyntheticEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchProviders } from '@/app/sevices/provider/provider'
import fetchProviderQueryOption, { fetchProviderTypeQueryOption } from '@/queryOptions/provider/providerQueryOptions'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import EditorForm from '@/components/e-form/newDefault/EditorForm'
import {
  useFetchFlowNnameQueryOption,
  useFetchWorkCountQueryOption,
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
import UserCreateTaskDialog from './UserCreateTaskDialog'
import { useDialog } from '@/hooks/useDialog'
import CardCount from '@/components/card/CardCount'
import { useDictionary } from '@/contexts/DictionaryContext'

const UserDashboardComponent = () => {
  const { showDialog } = useDialog()
  const router = useRouter()
  const params = useParams()
  const { dictionary } = useDictionary()
  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow_id')
  const mode = searchParams.get('mode')
  const dataId = searchParams.get('id')

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

  const shouldSkip = Boolean(flowId || dataId)

  const { data: flowData } = useFetchFlowNnameQueryOption(1, 999, {
    enabled: !shouldSkip
  })
  const { data: workMyData } = useFetchWorkMyQueryOption(page, pageSize, Number(selectedWorkflow), {
    enabled: !shouldSkip
  })
  const { mutateAsync: callNextFlow } = useNextFlowQueryOption()
  const { mutateAsync: callStartFlow } = useStartFlowQueryOption()
  const { data: countList } = useFetchWorkCountQueryOption({
    enabled: !shouldSkip
  })

  const handleClickManange = async (id: number | null, status: any, flowId?: any) => {
    try {
      let response
      if (status == 'draft' || status == 'start') {
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

  /*
  #nin fix url params
  ?mode=start&flow_id=96
  ?mode=draft&flow_id=96
  ?mode=active&id=156

  */

  useEffect(() => {
    if (shouldSkip) {
      handleClickManange(Number(dataId || 0), mode, Number(flowId))
    }
  }, [])

  if (currentSection === 'watchFlow' && viewFlowId !== null) {
    return <ViewFlowComponent formDataId={viewFlowId} onBack={handleBackShowFlow} />
  }

  if (currentSection === 'startFlow') return <UserStartTaskComponent data={dataNextFlow} />
  if (currentSection === 'nextFlow') return <UserNextTaskComponent data={dataNextFlow} isView={false} />

  return shouldSkip ? null : (
    <TabContext value={value}>
      <div className='flex flex-col gap-6'>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <CardCount
              title={dictionary?.cardOwnWork}
              count={countList?.result?.data[0]?.Total || 0}
              baseColor='rgba(116, 198, 250, 0.25)'
              textColor='rgb(116, 198, 250)'
              icon={Task}
              path='user/dashboard'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardCount
              title={dictionary?.cardFollowWork}
              count={countList?.result?.data[1]?.Total || 0}
              baseColor='rgba(67, 154, 226, 0.25)'
              textColor='rgb(67, 154, 226)'
              icon={PushPin}
              path='user/followTask'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardCount
              title={dictionary?.cardAllWork}
              count={countList?.result?.data[2]?.Total || 0}
              baseColor='rgba(30, 107, 175, 0.25)'
              textColor='rgb(30, 107, 175)'
              icon={ViewList}
              path='user/allTask'
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardCount
              title={dictionary?.cardDoneWork}
              count={countList?.result?.data[3]?.Total || 0}
              baseColor='rgba(23, 87, 155, 0.25)'
              textColor='rgb(23, 87, 155)'
              icon={AssignmentTurnedIn}
              path='user/doneTask'
            />
          </Grid>
        </Grid>

        <Card className='min-h-[581px]'>
          <CardContent>
            <TabPanel value='1'>
              <Grid container spacing={4}>
                <Grid item xs={12} className='flex items-center justify-between'>
                  <Typography variant='h5'>เอกสารของฉัน</Typography>
                  <Button
                    variant='contained'
                    startIcon={<Add style={{ width: '20px', height: '20px' }} />}
                    onClick={() => {
                      showDialog({
                        id: 'alertErrorToken',
                        component: <UserCreateTaskDialog id='alertErrorToken' onStartFlow={handleClickManange} />,
                        size: 'lg'
                      })
                    }}
                  >
                    สร้างเอกสารใหม่
                  </Button>
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
                    <MenuItem value={0}>
                      <em className='opacity-50'>เลือกเวิร์คโฟลว์ทั้งหมด</em>
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
                    isView={false}
                  />
                </Grid>
                <Divider />
              </Grid>
            </TabPanel>
          </CardContent>
        </Card>
      </div>
    </TabContext>
  )
}

export default UserDashboardComponent

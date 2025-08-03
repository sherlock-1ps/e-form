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

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import EditorForm from '@/components/e-form/newDefault/EditorForm'
import {
  InsertDriveFileOutlined,
  Task,
  PushPin,
  ViewList,
  AssignmentTurnedIn,
  Add,
  DoneAll,
  PendingActions
} from '@mui/icons-material'
import {
  useFetchFlowNnameQueryOption,
  useFetchWorkAllQueryOption,
  useFetchWorkCountQueryOption,
  useNextFlowQueryOption
} from '@/queryOptions/form/formQueryOptions'
import UserDashboardTable from '../dashboard/UserDashboardTable'
import { useFlowStore } from '@/store/useFlowStore'
import { useFormStore } from '@/store/useFormStore'
import { applyKeyValueToForm, updateFormValueByKey, updateSignature } from '@/utils/mapKeyValueForm'
import { toast } from 'react-toastify'
import UserStartTaskComponent from '../createTask/start/UserStartTaskComponent'
import UserNextTaskComponent from '../createTask/next/UserNextTaskComponent'
import ViewFlowComponent from '@/views/workflow/ViewFlowComponent'
import CardCount from '@/components/card/CardCount'
import { useDictionary } from '@/contexts/DictionaryContext'

import WorkLabel from '@/views/user/@components/workLabel'

const UserAllTaskComponent = () => {
  const router = useRouter()
  const params = useParams()
  const setFlowDiagramData = useFlowStore(state => state.setFlowDiagramData)
  const setFullForm = useFormStore(state => state.setFullForm)
  const { lang: locale } = params
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(0)
  const [dataNextFlow, setDataNextFlow] = useState({})
  const [viewFlowId, setViewFlowId] = useState<number | null>(null)
  const { dictionary } = useDictionary()

  const { data: flowData } = useFetchFlowNnameQueryOption(1, 999)
  const { data: workAllData } = useFetchWorkAllQueryOption(page, pageSize, Number(selectedWorkflow))
  const { mutateAsync: callNextFlow } = useNextFlowQueryOption()
  const { data: countList } = useFetchWorkCountQueryOption()

  const handleClickManange = async (id: number) => {
    try {
      const response = await callNextFlow({ form_data_id: id })
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
          form_details: updateForm,
          formDataId: response?.result?.data?.form_data_id
        }

        setFlowDiagramData(resultFlow)
        setFullForm(formFromApi)
        setDataNextFlow(response?.result?.data)

        setTimeout(() => {
          setCurrentSection('nextFlow')
        }, 350)
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

  if (currentSection === 'nextFlow') return <UserNextTaskComponent data={dataNextFlow} />

  return (
    <div className='flex flex-col gap-6'>
      {/* <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <CardCount
            title={dictionary?.cardOwnWork}
            count={countList?.result?.data[0]?.Total || 0}
            baseColor='rgba(116, 198, 250, 0.25)'
            textColor='rgb(116, 198, 250)'
            icon={Task}
            path='user/dashboard'
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardCount
            title={dictionary?.cardAllWork}
            count={countList?.result?.data[1]?.Total || 0}
            baseColor='rgba(30, 107, 175, 0.25)'
            textColor='rgb(30, 107, 175)'
            icon={ViewList}
            path='user/allTask'
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardCount
            title={dictionary?.cardDoneWork}
            count={countList?.result?.data[2]?.Total || 0}
            baseColor='rgba(23, 87, 155, 0.25)'
            textColor='rgb(23, 87, 155)'
            icon={AssignmentTurnedIn}
            path='user/doneTask'
          />
        </Grid>
      </Grid> */}
      <WorkLabel countList={countList} />
      <Card className='min-h-[581px]'>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5'>{dictionary?.pendingDocuments}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                select
                fullWidth
                label={dictionary?.selectWorkflow}
                value={selectedWorkflow}
                onChange={e => setSelectedWorkflow(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value={0}>
                  <em className='opacity-50'>{dictionary?.selectAllWorkflow}</em>
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
                projectTable={workAllData?.result?.data || []}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                count={workAllData?.result?.total}
                onManage={handleClickManange}
                onViewFlow={handleShowFlow}
              />
            </Grid>
            <Divider />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserAllTaskComponent

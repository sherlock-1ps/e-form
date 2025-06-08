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
  useFetchWorkAllQueryOption,
  useFetchWorkInProgressQueryOption,
  useNextFlowQueryOption
} from '@/queryOptions/form/formQueryOptions'
import UserDashboardTable from '../dashboard/UserDashboardTable'
import { useFlowStore } from '@/store/useFlowStore'
import { useFormStore } from '@/store/useFormStore'
import { updateFormValueByKey } from '@/utils/mapKeyValueForm'
import { toast } from 'react-toastify'
import UserStartTaskComponent from '../createTask/start/UserStartTaskComponent'

const UserFollowTaskComponent = () => {
  const router = useRouter()
  const params = useParams()
  const setFlowDiagramData = useFlowStore(state => state.setFlowDiagramData)
  const setFullForm = useFormStore(state => state.setFullForm)
  const { lang: locale } = params
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')
  const [dataNextFlow, setDataNextFlow] = useState({})

  const { data: flowData } = useFetchFlowNnameQueryOption(1, 999)
  const { data: workInPregressData } = useFetchWorkInProgressQueryOption(page, pageSize, Number(selectedWorkflow), {
    enabled: selectedWorkflow !== ''
  })
  const { mutateAsync: callNextFlow } = useNextFlowQueryOption()

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
          updateForm = updateFormValueByKey(response?.result?.data?.form_detail?.detail?.data, detailMerge?.data_detail)
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
          setCurrentSection('nextFlow')
        }, 350)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('ไม่สามารถเรียก flow ได้', { autoClose: 3000 })
    }
  }

  if (currentSection === 'nextFlow') return <UserStartTaskComponent data={dataNextFlow} />

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5'>งานที่กำลังติดตาม</Typography>
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
                <MenuItem value='' disabled>
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
                projectTable={workInPregressData?.result?.data || []}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                count={workInPregressData?.result?.total}
                onManage={handleClickManange}
              />
            </Grid>
            <Divider />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserFollowTaskComponent

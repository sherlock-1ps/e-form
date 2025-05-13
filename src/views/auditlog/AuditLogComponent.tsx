/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Button, Card, CardContent, Divider, Grid, MenuItem, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useSearchParams } from 'next/navigation'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { format } from 'date-fns'
import { forwardRef, useEffect, useRef, useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuditLogTable from './AuditLogTable'
import { formatToLocalEndOfDay, formatToLocalStartOfDay } from '@/utils/formatDateTime'
import {
  useFetchActionLogMutationOption,
  useFetchMenuLogMutationOption,
  useSearchLogMutationOption
} from '@/queryOptions/log/logQueryOptions'
import { cleanPayload } from '@/utils/cleanPayload'
import { AuditLogFilterPayload } from '@/types/auditlog/auditlogTypes'

const schema = z.object({
  menu_index: z.union([z.literal('all'), z.coerce.number()]).optional(),
  action: z.string().optional(),
  email: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional()
})

type FormData = z.infer<typeof schema>

const CustomInput = forwardRef(({ label, start, end, ...rest }: any, ref) => {
  const startDate = format(start, 'dd/MM/yyyy')
  const endDateStr = end ? ` - ${format(end, 'dd/MM/yyyy')}` : ''

  return <CustomTextField fullWidth inputRef={ref} {...rest} label={label} value={`${startDate}${endDateStr}`} />
})

const AuditLogComponent = () => {
  const { dictionary } = useDictionary()
  const searchParams = useSearchParams()
  const operatorFromURL = searchParams.get('operator')
  const operatorSelected = operatorFromURL ? JSON.parse(decodeURIComponent(operatorFromURL as string)) : null
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: new Date(),
      end_date: new Date(),
      menu_index: 'all',
      action: 'all',
      email: operatorSelected?.email ?? ''
    }
  })

  const { control, handleSubmit, watch, setValue, getValues } = methods

  const { data: menuList, isPending: pendingMenuList } = useFetchMenuLogMutationOption()
  const { data: actionList, isPending: pendingActionList } = useFetchActionLogMutationOption()

  const { mutate: searchLog, data: dataLog, isPending: pendingLogData, error } = useSearchLogMutationOption()

  const handleReset = () => {
    methods.reset({
      start_date: new Date(),
      end_date: new Date(),
      menu_index: 'all',
      action: 'all',
      email: ''
    })
  }

  const onSubmit = (data: FormData) => {
    const payload: AuditLogFilterPayload = {
      ...(data.start_date && { start_date: formatToLocalStartOfDay(data.start_date) }),
      ...(data.end_date && { end_date: formatToLocalEndOfDay(data.end_date) }),
      ...(data.menu_index !== 'all' && { menu_index: Number(data.menu_index) }),
      ...(data.action && data.action !== 'all' && { action: [data.action] }),
      ...(data.email && { email: data.email }),
      page,
      limit: pageSize
    }

    console.log('payload', payload)
    searchLog(payload)
  }

  useEffect(() => {
    const data = getValues()
    if (dataLog) {
      const payload: AuditLogFilterPayload = {
        ...(data.start_date && { start_date: formatToLocalStartOfDay(data.start_date) }),
        ...(data.end_date && { end_date: formatToLocalEndOfDay(data.end_date) }),
        ...(data.menu_index !== 'all' && { menu_index: Number(data.menu_index) }),
        ...(data.action && data.action !== 'all' && { action: [data.action] }),
        ...(data.email && { email: data.email }),
        page,
        limit: pageSize
      }

      console.log('payload', payload)
      searchLog(payload)
    }
  }, [page, pageSize])

  useEffect(() => {
    if (operatorSelected) {
      const data = getValues()
      const payload: AuditLogFilterPayload = {
        ...(data.start_date && { start_date: formatToLocalStartOfDay(data.start_date) }),
        ...(data.end_date && { end_date: formatToLocalEndOfDay(data.end_date) }),
        ...(data.menu_index !== 'all' && { menu_index: Number(data.menu_index) }),
        ...(data.action && data.action !== 'all' && { action: [data.action] }),
        ...(data.email && { email: data.email }),
        page,
        limit: pageSize
      }

      searchLog(payload)
    }
  }, [])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Card>
            <CardContent>
              <Typography variant='h5'>{dictionary['audit']?.auditLog}</Typography>
              <Divider className='my-4' />
              <Grid container spacing={4}>
                {/* Date Range */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='start_date'
                    control={control}
                    render={({ field }) => (
                      <AppReactDatepicker
                        selectsRange
                        startDate={watch('start_date')}
                        endDate={watch('end_date')}
                        onChange={([start, end]) => {
                          methods.setValue('start_date', start ?? undefined)
                          methods.setValue('end_date', end ?? undefined)
                        }}
                        customInput={
                          <CustomInput
                            label={dictionary?.dateRange}
                            start={watch('start_date')}
                            end={watch('end_date')}
                          />
                        }
                        shouldCloseOnSelect={false}
                      />
                    )}
                  />
                </Grid>

                {/* Menu */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='menu_index'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField select fullWidth {...field} label={dictionary?.menu} disabled={pendingMenuList}>
                        <MenuItem value='all'>All</MenuItem>
                        {menuList?.code === 'SUCCESS' &&
                          menuList?.data?.map((item: any) => (
                            <MenuItem key={item.menu_index} value={item.menu_index}>
                              {item.menu_name}
                            </MenuItem>
                          ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                {/* Action */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='action'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        {...field}
                        label={dictionary?.action}
                        disabled={pendingActionList}
                      >
                        <MenuItem value='all'>All</MenuItem>
                        {actionList?.code === 'SUCCESS' &&
                          actionList?.data?.action_log?.map((item: string) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                {/* Email Search */}
                <Grid item xs={12} sm={4.5}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={dictionary?.email}
                        placeholder={dictionary?.searchEmail}
                        size='small'
                        {...field}
                      />
                    )}
                  />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12} sm={4.5} alignItems={'end'} className='flex gap-2'>
                  <div className='w-full'>
                    <Button variant='outlined' fullWidth onClick={handleReset}>
                      {dictionary?.reset}
                    </Button>
                  </div>
                  <div className='w-full'>
                    <Button type='submit' fullWidth variant='contained'>
                      {dictionary?.search}
                    </Button>
                  </div>
                </Grid>
                {/* <Grid item xs={12} sm={2}>
                  <Button variant='outlined' fullWidth onClick={handleReset}>
                    {dictionary?.reset}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Button type='submit' variant='contained' fullWidth>
                    {dictionary?.search}
                  </Button>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </form>
      </FormProvider>

      <Card className='mt-4'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            {dataLog?.data?.total
              ? dictionary['auditlog']?.resultSearch?.replace('{{key}}', dataLog?.data?.total?.toLocaleString())
              : dictionary['auditlog']?.searchDetail}
          </Typography>
          <Divider className='mb-4' />
          {pendingLogData ? (
            <Typography>{dictionary?.loading}...</Typography>
          ) : (
            dataLog?.code === 'SUCCESS' && (
              <AuditLogTable
                data={dataLog?.data || { list: [] }}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
              />
            )
          )}
          {error && <Typography>{error?.message}</Typography>}
        </CardContent>
      </Card>
    </>
  )
}

export default AuditLogComponent

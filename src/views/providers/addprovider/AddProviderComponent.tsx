'use client'

import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, Chip, Divider, Grid, MenuItem, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import ProviderLogo from './ProviderLogo'
import {
  fetchCurrencyProviderQueryOption,
  fetchProviderTypeQueryOption
} from '@/queryOptions/provider/providerQueryOptions'
import { createGameProvider } from '@/app/sevices/provider/provider'

const AddProviderComponent = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [fileImg, setFileImg] = useState(null)

  // ✅ Fetch Provider Types & Currencies in Parallel
  const [providerTypesQuery, currencyProvidersQuery] = useQueries({
    queries: [fetchProviderTypeQueryOption(), fetchCurrencyProviderQueryOption()]
  })

  const { data: providerTypes, isLoading: loadingProviderTypes } = providerTypesQuery
  const { data: currencyProviders, isLoading: loadingCurrencyProviders } = currencyProvidersQuery

  // ✅ Set Up `useForm`
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      provider_name: '',
      provider_code: '',
      provider_type: [],
      currency: [],
      share_percentage: '',
      external_secret_key: '',
      encrypt_key: '',
      remark: '',
      auto_scale_config: ''
    },
    mode: 'onBlur'
  })

  // ✅ Submit Form
  const { mutate, isPending } = useMutation({
    mutationFn: createGameProvider,
    onError: error => {
      console.error('Error creating game provider:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gameProvider'] })
      reset()
    }
  })

  const onSubmit = (data: any) => {
    if (!fileImg) {
      mutate({ ...data })
    } else {
      mutate({ ...data, image: fileImg })
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container className='flex flex-col gap-6'>
            <Grid item xs={12} sm className='flex gap-2 justify-between'>
              <Typography variant='h5' className='text-nowrap'>
                Add Provider
              </Typography>
            </Grid>
            <Divider />

            <Grid container className='flex gap-6'>
              <Grid item xs={12} sm={4}>
                <ProviderLogo setFileImg={setFileImg} />
              </Grid>
              <Grid item xs={12} sm className='flex flex-col gap-2'>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='Provider Name'
                  {...register('provider_name', { required: 'Provider Name is required' })}
                  error={!!errors.provider_name}
                  helperText={errors.provider_name?.message}
                />
                <Controller
                  name='provider_type'
                  control={control}
                  rules={{ validate: value => (value.length > 0 ? true : 'Provider Type is required') }}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Provider Type'
                      {...field}
                      error={!!errors.provider_type}
                      helperText={errors.provider_type?.message}
                      SelectProps={{
                        multiple: true,
                        renderValue: selected => {
                          const selectedValues = selected as string[]

                          const maxDisplayCount = 3

                          return (
                            <div className='flex gap-1 flex-wrap'>
                              {selectedValues.slice(0, maxDisplayCount).map(value => (
                                <Chip key={value} label={value} size='small' />
                              ))}
                              {selectedValues.length > maxDisplayCount && (
                                <Chip label={`+${selectedValues.length - maxDisplayCount} more`} size='small' />
                              )}
                            </div>
                          )
                        }
                      }}
                    >
                      {loadingProviderTypes ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        providerTypes?.code === 'SUCCESS' &&
                        providerTypes?.data?.provider_type.map((item: string, idx: number) => (
                          <MenuItem key={idx} value={item} className='capitalize'>
                            {item}
                          </MenuItem>
                        ))
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm className='flex flex-col gap-2'>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='Provider Code'
                  {...register('provider_code', { required: 'Provider Code is required' })}
                  error={!!errors.provider_code}
                  helperText={errors.provider_code?.message}
                />
                <Controller
                  name='currency'
                  control={control}
                  rules={{ validate: value => (value.length > 0 ? true : 'Currency is required') }}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Currency'
                      {...field}
                      error={!!errors.currency}
                      helperText={errors.currency?.message}
                      SelectProps={{
                        multiple: true,
                        renderValue: selected => {
                          const selectedValues = selected as string[]

                          const maxDisplayCount = 3

                          return (
                            <div className='flex gap-1 flex-wrap'>
                              {selectedValues.slice(0, maxDisplayCount).map(value => (
                                <Chip key={value} label={value} size='small' />
                              ))}
                              {selectedValues.length > maxDisplayCount && (
                                <Chip label={`+${selectedValues.length - maxDisplayCount} more`} size='small' />
                              )}
                            </div>
                          )
                        }
                      }}
                    >
                      {loadingCurrencyProviders ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        currencyProviders?.code === 'SUCCESS' &&
                        currencyProviders?.data?.currencies.map((item: string, idx: number) => (
                          <MenuItem key={idx} value={item} className='capitalize'>
                            {item}
                          </MenuItem>
                        ))
                      )}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  type='number'
                  label='Share %'
                  {...register('share_percentage', { required: 'Share Percentage is required' })}
                  error={!!errors.share_percentage}
                  helperText={errors.share_percentage?.message}
                />
              </Grid>
            </Grid>

            {/* ✅ External Secret Key */}
            <CustomTextField
              fullWidth
              type='text'
              label='External Secret Key'
              {...register('external_secret_key', { required: 'External Secret Key is required' })}
              error={!!errors.external_secret_key}
              helperText={errors.external_secret_key?.message}
            />
            <CustomTextField
              fullWidth
              type='text'
              label='Encrypt Key'
              {...register('encrypt_key', { required: 'Encrypt Key is required' })}
              error={!!errors.encrypt_key}
              helperText={errors.encrypt_key?.message}
            />
            <CustomTextField
              fullWidth
              type='text'
              label='Remark'
              {...register('remark', { required: 'Remark is required' })}
              error={!!errors.remark}
              helperText={errors.remark?.message}
            />

            {/* ✅ Auto Scale Config */}
            <CustomTextField
              fullWidth
              rows={10}
              multiline
              label='Auto Scale Config'
              {...register('auto_scale_config', { required: 'Auto Scale Config is required' })}
              error={!!errors.auto_scale_config}
              helperText={errors.auto_scale_config?.message}
              sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
            />

            {/* ✅ Action Buttons */}
            <Grid item xs={12} className='flex gap-2 justify-end'>
              <Button variant='outlined' color='primary' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant='contained' color='primary' type='submit' disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Provider'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddProviderComponent

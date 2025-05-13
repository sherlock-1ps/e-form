// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import StepperWrapper from '@/@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import { toast } from 'react-toastify'
import DirectionalIcon from '@/components/DirectionalIcon'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useDialog } from '@/hooks/useDialog'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useAuthStore } from '@/store/useAuthStore'
import {
  useCreateCredentialMutationOption,
  useFetchProviderCredentialMutationOption
} from '@/queryOptions/credential/credentialQueryOptions'
import SelectProviderListTable from './SelectProviderListTable'
import ConfirmProviderListTable from './ConfirmProviderListTable'
import { createCredential } from '@/app/sevices/credential/credentialService'
import { useHasPermission } from '@/hooks/useHasPermission'

type FormDataType = {
  prefix: string
  credential: string
  description: string
  provider: any
}
type ProviderCredentialType = {
  provider_code: string
  credential_percent?: number
  selectShare: number | string
  is_select: boolean
}
const generateRandomCredential = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

const CreateCredentialComponent = () => {
  const router = useRouter()
  const { showDialog } = useDialog()
  const { dictionary } = useDictionary()
  const { lang: locale } = useParams()
  const profileData = useAuthStore(state => state.profile)
  const { hasPermission } = useHasPermission()
  const [activeStep, setActiveStep] = useState(0)
  const [formValues, setFormValues] = useState<FormDataType>({
    prefix: profileData?.operator_prefix ?? '',
    credential: generateRandomCredential(),
    description: '',
    provider: []
  })

  const steps = [
    {
      title: dictionary['credential']?.credentialSetting,
      subtitle: dictionary['credential']?.selectCredential
    },
    {
      title: dictionary['credential']?.credentialConfirm,
      subtitle: dictionary['credential']?.credentialSummary
    }
  ]
  const schema = z.object({
    prefix: z.string().min(3, dictionary['credential']?.requiredPrefix),
    credential: z.string().min(6, dictionary['credential']?.credentialRequired)
  })

  const {
    register,
    handleSubmit,
    setError,
    setValue, // ✅ Allows setting values dynamically
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: formValues
  })

  const {
    data: providerData,
    isPending: pendingProviderData,
    error: errorProviderData
  } = useFetchProviderCredentialMutationOption()

  const { mutateAsync: createCredential, isPending: pendingCreateCredential } = useCreateCredentialMutationOption()

  const handleBack = () => {
    setFormValues(getValues())
    Object.keys(formValues).forEach(field => {
      setValue(field as keyof typeof formValues, formValues[field as keyof typeof formValues])
    })
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleFormSubmit = async (data: FormDataType) => {
    if (activeStep == 0) {
      setValue('provider', formValues.provider)
      const latestValues = getValues()

      const resultProvider = Object.values(latestValues?.provider || {})
        .flat()
        .filter((p): p is ProviderCredentialType => {
          return (p as ProviderCredentialType).is_select && Number((p as ProviderCredentialType).selectShare) > 0
        })
        .map(p => ({
          provider_code: p.provider_code,
          credential_percent: Number(p.selectShare) || 0
        }))

      if (resultProvider.length == 0) {
        toast.error(dictionary['credential']?.atLeastOneProvider, { autoClose: 3000 })

        return
      }

      setFormValues(latestValues)
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    } else if (activeStep === steps.length - 1) {
      await handleConfirmCreateOperatorCredential(data)
    }
  }

  const handleConfirmCreateOperatorCredential = async (data: FormDataType) => {
    try {
      const latestValues = getValues()

      const resultProvider = Object.values(latestValues?.provider || {})
        .flat()
        .filter((p): p is ProviderCredentialType => {
          return (p as ProviderCredentialType).is_select && Number((p as ProviderCredentialType).selectShare) > 0
        })
        .map(p => ({
          provider_code: p.provider_code,
          credential_percent: Number(p.selectShare) || 0
        }))

      const payload = {
        credential_prefix: data.credential,
        ...(latestValues?.description && { description: latestValues.description }),
        credential_provider: resultProvider
      }

      const response = await createCredential(payload)

      if (response?.code == 'SUCCESS') {
        toast.success(dictionary?.createSuccess, { autoClose: 3000 })
        router.push(`/${locale}/credential`)
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as any).code === 'string') {
        const err = error as { code: string }
        if (err.code === 'CREDENTIAL_PREFIX_DUPLICATED') {
          toast.error('CREDENTIAL_PREFIX_DUPLICATED', { autoClose: 3000 })
          setError('credential', {
            type: 'manual',
            message: 'This credential prefix already exists'
          })
        } else {
          toast.error(dictionary?.createFailed, { autoClose: 3000 })
        }
      } else {
        toast.error('Unexpected error', { autoClose: 3000 })
      }
    }
  }

  const handleUpdateProvider = (category: string, index?: number, share?: number, list?: ProviderCredentialType[]) => {
    setFormValues(prev => {
      const currentProvider = prev.provider || {}

      let updatedCategory: ProviderCredentialType[]

      if (list) {
        updatedCategory = list
      } else {
        const categoryList = currentProvider[category] || []
        updatedCategory = categoryList.map((item: any, idx: number | undefined) => {
          if (idx === index) {
            return {
              ...item,
              ...(share !== undefined && { selectShare: share })
            }
          }

          return item
        })
      }

      return {
        ...prev,
        provider: {
          ...currentProvider,
          [category]: updatedCategory
        }
      }
    })
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                label={dictionary['credential']?.credentialPrefix}
                placeholder=''
                {...register('credential', {
                  onChange: e => {
                    e.target.value = e.target.value.toUpperCase() // 🔥 Converts to uppercase
                  }
                })}
                error={!!errors.credential}
                helperText={errors.credential?.message}
                inputProps={{ maxLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography className=' uppercase'>{formValues.prefix}-</Typography>{' '}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => {
                          const randomCredential = generateRandomCredential()
                          setValue('credential', randomCredential)
                          setFormValues(prev => ({ ...prev, credential: randomCredential }))
                        }}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={'tabler-refresh'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <CustomTextField
                fullWidth
                label={dictionary['descriptionOptional']}
                placeholder=''
                {...register('description')}
              />
            </Grid>

            <Grid item xs={12}>
              {formValues?.provider && (
                <Typography variant='h6'>{dictionary['credential']?.choosePvdToCreateCredential}</Typography>
              )}
              {pendingProviderData && <p>{dictionary?.loading}...</p>}
              {errorProviderData && <p>{errorProviderData.message}</p>}
            </Grid>

            {formValues?.provider &&
              Object.entries(formValues?.provider).map(([categoryKey, providers]) => (
                <Grid item xs={12} sm={12} key={categoryKey}>
                  <Typography variant='h6' className='capitalize'>
                    {categoryKey} Type
                  </Typography>

                  <SelectProviderListTable
                    dataTable={providers}
                    category={categoryKey}
                    updateMain={handleUpdateProvider}
                  />
                </Grid>
              ))}
          </>
        )
      case 1:
        return (
          <>
            <Grid item xs={12}>
              <Typography variant='h5'>{dictionary['credential']?.credentialDetail}</Typography>
            </Grid>
            <Grid item xs={12} className='flex gap-16'>
              <div className='flex flex-col'>
                <Typography>{dictionary['credential']?.credentialPrefix}</Typography>
                <Typography color={'text.primary'}>
                  {profileData?.operator_prefix} - {formValues?.credential}
                </Typography>

                {errors.credential?.message && (
                  <Typography className=' text-error'>{errors.credential?.message}</Typography>
                )}
              </div>
              {formValues?.description && (
                <div className='flex flex-col'>
                  <Typography>{dictionary?.description}</Typography>
                  <Typography color={'text.primary'}>{formValues.description}</Typography>
                </div>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {formValues?.provider &&
              Object.entries(formValues?.provider).map(([categoryKey, providers]) => {
                const typedProviders = providers as ProviderCredentialType[]

                const filteredProviders = typedProviders.filter(
                  provider => provider?.is_select === true && provider?.selectShare
                )

                if (filteredProviders.length === 0) return null

                return (
                  <Grid item xs={12} sm={12} key={categoryKey}>
                    <ConfirmProviderListTable dataTable={filteredProviders} category={categoryKey} />
                  </Grid>
                )
              })}
          </>
        )
      default:
        return 'Unknown step'
    }
  }

  const renderTitle = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return dictionary['credential']?.credentialSetting
      case 1:
        return dictionary['credential']?.creSummary

      default:
        return dictionary['credential']?.credentialSetting
    }
  }

  useEffect(() => {
    if (providerData?.data) {
      const updatedProvider = Object.entries(providerData.data)
        .filter(([, value]) => Array.isArray(value) && value.length > 0) // ✅ skip empty arrays
        .reduce(
          (acc, [key, value]) => {
            acc[key] = (value as any[]).map(item => ({
              ...item,
              selectShare: '',
              is_select: true
            }))

            return acc
          },
          {} as Record<string, any[]>
        )

      setFormValues(prev => ({
        ...prev,
        provider: updatedProvider
      }))
    }
  }, [providerData])

  return (
    <>
      <StepperWrapper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => {
            return (
              <Step key={label.title}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <div>
                      <Typography className='step-title'>{label.title}</Typography>
                      <Typography className='step-subtitle'>{label.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      <Card className='mt-4'>
        <CardContent>
          {activeStep === steps.length ? (
            <>
              <Typography className='mlb-2 mli-1'>{dictionary['credential']?.allStepComplete} </Typography>
              <div className='flex justify-end mt-4  gap-4'>
                <Button
                  variant='tonal'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  color='secondary'
                  startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-' />}
                >
                  {dictionary['previous']}
                </Button>
                {hasPermission('create-operator-17') && (
                  <Button variant='contained' color='success' endIcon={<i className='tabler-check' />}>
                    {dictionary['credential']?.createOperator}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Typography variant='h4' color='text.primary'>
                      {renderTitle(activeStep)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  {renderStepContent(activeStep)}
                  <Grid item xs={12} className='flex justify-between'>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        showDialog({
                          id: 'alertDialogConfirmDiscardCreateOperator',
                          component: (
                            <ConfirmAlert
                              id='alertDialogConfirmDiscardCreateOperator'
                              title={dictionary['credential']?.areYouSureDiscard}
                              content1={dictionary['credential']?.discardThisCreateOperator}
                              onClick={() => {
                                router.back()
                              }}
                            />
                          ),
                          size: 'sm'
                        })
                      }}
                    >
                      {dictionary['discard']}
                    </Button>

                    <div className='flex gap-4'>
                      <Button
                        variant='tonal'
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        color='secondary'
                        startIcon={
                          <DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />
                        }
                      >
                        {dictionary['previous']}
                      </Button>
                      <Button
                        type='submit'
                        variant='contained'
                        // onClick={handleNext}
                        disabled={pendingCreateCredential}
                        endIcon={
                          activeStep === steps.length - 1 ? (
                            <i className='tabler-check' />
                          ) : (
                            <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                          )
                        }
                      >
                        {pendingCreateCredential
                          ? `${dictionary?.loading}...`
                          : activeStep === steps.length - 1
                            ? dictionary?.submit
                            : dictionary?.next}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default CreateCredentialComponent

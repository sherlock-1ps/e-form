// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import CodeInput from '@/components/CodeInput'
import { useSendEmailMutationOption, useSetEmailMutationOption } from '@/queryOptions/profile/profileQueryOptions'
import { toast } from 'react-toastify'
import { fetchProfile } from '@/app/sevices/profile/profileServices'
import { useAuthStore } from '@/store/useAuthStore'
import Axios from '@/libs/axios/axios'
import { useDictionary } from '@/contexts/DictionaryContext'

interface emailDialogProps {
  id: string
  email: string
}

const EmailAuthVerifyDialog = ({ id, email }: emailDialogProps) => {
  const { dictionary } = useDictionary()
  const { closeDialog } = useDialog()
  const [activeStep, setActiveStep] = useState(0)
  const [code, setCode] = useState('')

  const { mutateAsync: callSendEmail, isPending: pendingSendEmail } = useSendEmailMutationOption()
  const { mutateAsync: callSetEmail, isPending: pendingSetEmail } = useSetEmailMutationOption()
  const nextStep = async () => {
    if (activeStep == 0) {
      handleSendEmail()
    }
    if (activeStep == 1) {
    }
  }

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1)
  }

  const handleSendEmail = async () => {
    try {
      const response = await callSendEmail({ email })
      if (response?.code == 'SUCCESS') {
        if (activeStep < 1) setActiveStep(prev => prev + 1)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Failed to send Email!', { autoClose: 3000 })
    }
  }

  const handleSetCode = (code: string) => {
    setCode(code)
    handleSetEmail(code)
  }

  const handleSetEmail = async (code: string) => {
    try {
      const response = await callSetEmail({ pincode: code, is_setup: true, email })
      if (response?.code == 'SUCCESS') {
        toast.success('Add Email 2FA Success!', { autoClose: 3000 })
        const resultProfile = await fetchProfile()
        if (resultProfile?.data) {
          useAuthStore.getState().setProfile(resultProfile.data)
          closeDialog(id)
        } else {
          toast.error('failed to get profile ,please login again', { autoClose: 3000 })
          const response = await Axios.get('/logout')

          if (response?.data?.code == 'SUCCESS') {
            useAuthStore.getState().clearTokens()
          }
        }
      }
    } catch (error) {
      console.log('error', error)
      if ((error as { code?: string })?.code === 'OTP_NOT_MATCH') {
        toast.error('Failed, code mismatch', { autoClose: 3000 })
      } else {
        toast.error('Failed to add 2FA email!', { autoClose: 3000 })
      }
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{dictionary['profile']?.emailSetup}</Typography>
      </Grid>
      <Divider />
      <Grid container spacing={4}>
        {activeStep === 0 && (
          <>
            <Grid item xs={12}>
              <Typography>{dictionary['profile']?.emailDetail}</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className='flex  gap-2'>
                <Typography className=' text-nowrap'>Step 1:</Typography>
                <div className='flex flex-col gap-2'>
                  <Typography variant='h6'>{dictionary['profile']?.sendVerifyCode}</Typography>

                  <CustomTextField fullWidth label='Email' autoComplete='off' value={email} disabled />
                </div>
              </div>
            </Grid>
          </>
        )}

        {activeStep === 1 && (
          <Grid item xs={12} className='flex flex-col gap-4'>
            <div className='flex gap-2 '>
              <Typography className=' text-nowrap'>Step 3:</Typography>
              <Typography variant='h6'>{dictionary['profile']?.enterCode}</Typography>
            </div>
            <Typography className='text-center'>
              {dictionary['profile']?.sendEmail} {email}
            </Typography>
            <CodeInput
              onComplete={code => {
                handleSetCode(code)
              }}
            />
          </Grid>
        )}
      </Grid>

      <Grid item xs={12} className='flex items-center justify-between gap-2'>
        <Button variant='outlined' onClick={prevStep} disabled={activeStep === 0}>
          {dictionary?.previous}
        </Button>
        {activeStep < 1 ? (
          <Button
            variant='contained'
            onClick={nextStep}
            disabled={!email.includes('@') || pendingSendEmail || pendingSetEmail}
          >
            {dictionary?.next}
          </Button>
        ) : (
          <Button
            variant='contained'
            color='success'
            onClick={() => {
              handleSetEmail(email)
            }}
          >
            {dictionary?.verify}
          </Button>
        )}
      </Grid>
    </Grid>
  )
}

export default EmailAuthVerifyDialog

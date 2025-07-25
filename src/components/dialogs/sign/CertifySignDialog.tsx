'use client'

import Button from '@mui/material/Button'
import {
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

import {
  useGetCertificatesExternalQueryOption,
  useVerifyCertificateExternalQueryOption
} from '@/queryOptions/form/formQueryOptions'

interface signProps {
  id: string
  onSave: (comment: string, signType: string) => Promise<any>
  signType: string
}

const CertifySignDialog = ({ id, onSave, signType }: signProps) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const { closeDialog } = useDialog()

  const [comment, setComment] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const { data: certificates } = useGetCertificatesExternalQueryOption({
    enabled: true
  })
  const { mutateAsync: VerifyCertificate } = useVerifyCertificateExternalQueryOption()

  const [selectCertificate, setSelectCertificate] = useState('0')
  // console.log("Certificates", certificates?.data[0]?.F_DIGITAL_CERTIFICATE_ID)
  const handleConfirm = async () => {
    if (selectCertificate == '0') {
      toast.error(dictionary?.pleaseChooseElectronicCertificate, { autoClose: 3000 })
      return
    }

    const response: any = await VerifyCertificate({ password })
    if (!response?.data?.result) {
      toast.error(dictionary?.invalidPassword, { autoClose: 3000 })
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await onSave(comment, signType)
      if (response?.code === 'SUCCESS') {
        toast.success(dictionary?.saveSuccessful, { autoClose: 3000 })
        closeDialog(id)
        router.push(`/${locale}/user/dashboard`)
      }
    } catch (err) {
      console.error('save failed', err)
      toast.error(dictionary?.saveFailed, { autoClose: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (event: any) => {
    setSelectCertificate(event.target.value)
  }

  // {certificates?.data?.map((i: any) => {
  //   return (
  //     <MenuItem key={i.F_DIGITAL_CERTIFICATE_ID} value={i.F_DIGITAL_CERTIFICATE_ID}>
  //       {i.F_SERIAL_NUMBER}
  //     </MenuItem>
  //   )
  // })}

  useEffect(() => {
    if (certificates?.data?.length > 0) {
      setSelectCertificate(certificates?.data[0].F_DIGITAL_CERTIFICATE_ID || '0')
    }
  }, [certificates?.data])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนาม (ใบรับรองอิเล็กทรอนิกส์)
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          rows={4}
          multiline
          fullWidth
          label={dictionary?.comment}
          placeholder={dictionary?.typeYourCommentHere}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>{dictionary?.authenticate}</Typography>
      </Grid>
      <Grid item xs={6}>
        <InputLabel>เลือกใบรับรองอิเล็กทรอนิกส์</InputLabel>
        <FormControl fullWidth>
          <Select size='small' fullWidth value={selectCertificate} onChange={handleChange}>
            <MenuItem value={'0'}>เลือกใบรับรองอิเล็กทรอนิกส์</MenuItem>
            {certificates?.data?.map((i: any) => {
              return (
                <MenuItem key={i.F_DIGITAL_CERTIFICATE_ID} value={i.F_DIGITAL_CERTIFICATE_ID}>
                  {i.F_SERIAL_NUMBER}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        {/* <CustomTextField select fullWidth defaultValue={''} label='เลือกใบรับรองอิเล็กทรอนิกส์'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {certificates?.data?.map((i: any) => {
            return (
              <MenuItem key={i.F_DIGITAL_CERTIFICATE_ID} value={i.F_DIGITAL_CERTIFICATE_ID}>
                {i.F_SUBJECT}
              </MenuItem>
            )
          })}
        </CustomTextField> */}
      </Grid>
      <Grid item xs={6}>
        <CustomTextField
          fullWidth
          label='รหัสผ่าน'
          type={isPasswordShown ? 'text' : 'password'}
          onChange={e => {
            setPassword(e.target.value)
          }}
          value={password}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                  <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center justify-end gap-2'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)}>
          {dictionary?.cancel}
        </Button>
        <Button variant='contained' onClick={handleConfirm} disabled={selectCertificate == '0'}>
          {dictionary?.confirm}
          {/* {isSubmitting ? dictionary?.saving : dictionary?.confirm} */}
        </Button>
      </Grid>
    </Grid>
  )
}

export default CertifySignDialog

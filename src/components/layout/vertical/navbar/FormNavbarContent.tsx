'use client'
import { Publish, Preview, EditOutlined } from '@mui/icons-material'
import { useState } from 'react'

// Component Imports

// Util Imports
import { IconButton, Typography, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { useCreateFormQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useFormStore } from '@/store/useFormStore'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

const FormNavbarContent = () => {
  const { lang: locale } = useParams()
  const router = useRouter()
  const form = useFormStore(state => state.form)
  const clearForm = useFormStore(state => state.clearForm)
  const [title, setTitle] = useState(form?.name)
  const [versionText, setVersionText] = useState(form?.version)
  const { mutateAsync, isPending } = useCreateFormQueryOption()
  const updateFormMeta = useFormStore(state => state.updateFormMeta)

  const handleInputChange = (e: any) => {
    setTitle(e.target.value)
    updateFormMeta({ name: e.target.value })
  }

  const handleInputVersion = (e: any) => {
    setVersionText(e.target.value)
    updateFormMeta({ version: e.target.value })
  }

  const handleShowPreview = () => {
    window.open(`/draftform`, '_blank')
  }

  const handleClickSave = async () => {
    try {
      const request = {
        name: form?.name,
        versions: [
          {
            version: form?.version,
            form_details: [{ detail: { data: form?.form_details } }]
            // form_details:
            //   Array.isArray(form?.form_details) && form.form_details.length === 0
            //     ? []
            //     : [{ detail: { data: form?.form_details } }]
          }
        ]
      }

      const response = await mutateAsync({ request })
      if (response?.code == 'SUCCESS') {
        toast.success('สร้างแบบฟอร์มสำเร็จ!', { autoClose: 3000 })
        router.push(`/${locale}/admin/dashboard`)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('สร้างแบบฟอร์มล้มเหลว!', { autoClose: 3000 })
    }
  }

  return (
    <div className='w-full flex gap-2'>
      <div className='flex flex-col flex-1  '>
        <div className='flex gap-2 items-center'>
          <Typography>Name :</Typography>
          <TextField value={title} onChange={handleInputChange} variant='standard' />
          <IconButton edge='end' onMouseDown={e => e.preventDefault()} className='p-1'>
            <EditOutlined sx={{ width: '16px', height: '18px' }} />
          </IconButton>
        </div>
        <div className='flex gap-2 items-center'>
          <Typography>version :</Typography>

          <TextField value={versionText} onChange={handleInputVersion} variant='standard' />
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button color='primary' variant='outlined' onClick={handleShowPreview} startIcon={<Preview />}>
          ดูแบบร่าง
        </Button>

        <Button
          disabled={isPending}
          color='primary'
          variant='contained'
          onClick={handleClickSave}
          endIcon={<Publish />}
        >
          บันทึกและสร้าง
        </Button>
      </div>
    </div>
  )
}

export default FormNavbarContent

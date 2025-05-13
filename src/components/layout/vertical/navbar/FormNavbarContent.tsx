'use client'
import { Publish, Preview, EditOutlined, NewReleasesOutlined, SaveOutlined } from '@mui/icons-material'
import { useState } from 'react'

// Component Imports

// Util Imports
import { IconButton, Typography, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import {
  useCreateFormQueryOption,
  useCreateNewVersionFormQueryOption,
  useUpdateFormQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { useFormStore } from '@/store/useFormStore'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

const FormNavbarContent = () => {
  const { lang: locale } = useParams()
  const router = useRouter()
  const updateFormMeta = useFormStore(state => state.updateFormMeta)
  const form = useFormStore(state => state.form)
  const clearForm = useFormStore(state => state.clearForm)
  const [title, setTitle] = useState(form?.name)
  const [versionText, setVersionText] = useState(form?.version)
  const { mutateAsync, isPending } = useCreateFormQueryOption()

  const { mutateAsync: updateForm, isPending: pendingUpdate } = useUpdateFormQueryOption()
  const { mutateAsync: createNewVersion, isPending: pendingCreateNewVersion } = useCreateNewVersionFormQueryOption()

  const handleInputChange = (e: any) => {
    setTitle(e.target.value)
    updateFormMeta({ name: e.target.value })
  }

  const handleInputVersion = (e: any) => {
    if (form?.isContinue) return
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

  const handleClickUpdate = async () => {
    try {
      const request = {
        id: form?.formId,
        name: form?.name,
        versions: [
          {
            id: form?.versionId,
            form_details: [{ detail: { data: form?.form_details } }]
          }
        ]
      }

      const response = await updateForm({ request })
      if (response?.code == 'SUCCESS') {
        toast.success('อัพเดทฟอร์มสำเร็จ!', { autoClose: 3000 })
        router.push(`/${locale}/admin/dashboard`)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('อัพเดทฟอร์มล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleCreateNewVersion = async () => {
    try {
      const request = {
        id: form?.formId,
        versions: [
          {
            version: form?.newVersion,
            form_details: [{ detail: { data: form?.form_details } }]
          }
        ]
      }

      const response = await createNewVersion({ request })
      if (response?.code == 'SUCCESS') {
        toast.success('สร้างเวอร์ชั่นใหม่สำเร็จ!', { autoClose: 3000 })
        router.push(`/${locale}/admin/dashboard`)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('สร้างเวอร์ชั่นใหม่ล้มเหลว!', { autoClose: 3000 })
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
        {form?.isContinue ? (
          <Button
            disabled={pendingUpdate || pendingCreateNewVersion}
            color='primary'
            variant='contained'
            endIcon={<SaveOutlined />}
            onClick={form?.version !== form?.newVersion ? handleCreateNewVersion : handleClickUpdate}
          >
            บันทึก
          </Button>
        ) : (
          <Button
            disabled={isPending}
            color='primary'
            variant='contained'
            onClick={handleClickSave}
            endIcon={<Publish />}
          >
            บันทึก
          </Button>
        )}

        {/* {form?.isContinue && (
          <Button color='primary' variant='contained' endIcon={<NewReleasesOutlined />}>
            สร้างเวอร์ชั่นใหม่
          </Button>
        )} */}
      </div>
    </div>
  )
}

export default FormNavbarContent

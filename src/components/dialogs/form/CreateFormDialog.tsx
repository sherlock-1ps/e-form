'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { useParams, useRouter } from 'next/navigation'
import { useFormStore } from '@/store/useFormStore'

interface createFormProps {
  id: string
  onClick: () => void
}

interface FormCardProps {
  title: string
  image?: string
  isEmpty?: boolean
  onClick?: () => void
}

const FormCard = ({ title, image, isEmpty, onClick }: FormCardProps) => {
  return (
    <Button
      variant='contained'
      onClick={onClick}
      className={`p-0  rounded-md overflow-hidden flex flex-col justify-between ${
        isEmpty ? 'bg-[#F1F5FF]' : 'bg-[#F1F3F6]'
      }`}
      style={{ width: 208, height: 262 }}
    >
      <div className='flex flex-1 items-center justify-center p-4'>
        {isEmpty ? (
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 32, color: '#0463EA' }} />
        ) : (
          <img src={image} alt={title} className='rounded-md max-h-[190px] object-contain' />
        )}
      </div>
      <Typography
        variant='h6'
        sx={{
          bgcolor: isEmpty ? '#2D78DB' : '#C3D5F6',
          color: isEmpty ? 'white' : '#2D78DB'
        }}
        className='w-full py-2'
      >
        {title}
      </Typography>
    </Button>
  )
}

const CreateFormDialog = ({ id, onClick }: createFormProps) => {
  const router = useRouter()
  const { closeDialog } = useDialog()
  const { lang: locale } = useParams()
  const createForm = useFormStore(state => state.createForm)

  const handleCreateNewForm = () => {
    const shortId = Date.now().toString(36) // แปลง timestamp เป็น id สั้น
    createForm(shortId, '1.0.0')
    router.push(`/${locale}/admin/form`)
    closeDialog(id)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className=''>
          สร้างฟอร์มใหม่ | e-Form
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        {/* <Typography variant='h6'>เลือกเทมเพลต</Typography> */}
      </Grid>
      <div className='flex items-center justify-center gap-4 flex-wrap w-full mt-4'>
        <FormCard title='ฟอร์มว่าง' isEmpty onClick={handleCreateNewForm} />
        {/* <FormCard title='ใบจัดซื้อ' image='/images/test/test01.png' onClick={() => console.log('Open form')} /> */}
      </div>
    </Grid>
  )
}

export default CreateFormDialog

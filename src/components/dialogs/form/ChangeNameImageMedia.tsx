// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  useChangeRoleAccountOwnerMutationOption,
  useFetchRoleQueryOption
} from '@/queryOptions/account/accountQueryOptions'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useChangeNameImageMediaQueryOption } from '@/queryOptions/form/formQueryOptions'

interface confirmProps {
  id: string
  onClick?: () => void
  data: any
}

const ChangeNameImageMedia = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()
  const { dictionary } = useDictionary()
  const [newName, setNewName] = useState('')
  const { mutateAsync, isPending } = useChangeNameImageMediaQueryOption()

  const handleSubmit = async () => {
    if (!newName) {
      toast.error('กรุณากรอกชื่อไฟล์ใหม่', { autoClose: 3000 })

      return
    }
    try {
      const response = await mutateAsync({ name: newName, id: data.id })
      if (response?.code == 'SUCCESS') {
        toast.success('เปลี่ยนชื่อสำเร็จ!', { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (error) {
      toast.error('เปลี่ยนชื่อล้มเหลว', { autoClose: 3000 })
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>แก้ไขชื่อไฟล์</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField fullWidth type='text' label='ชื่อไฟล์เก่า' placeholder='' disabled value={data?.name ?? ''} />
      </Grid>

      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField
          fullWidth
          type='text'
          label='ชื่อไฟล์ใหม่ (ไม่ต้องกรอกสกุลไฟล์)'
          placeholder=''
          value={newName}
          onChange={e => {
            setNewName(e.target.value)
          }}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='outlined'
          onClick={() => {
            closeDialog(id)
          }}
        >
          {dictionary?.cancel}
        </Button>
        <Button
          disabled={isPending}
          variant='contained'
          onClick={() => {
            handleSubmit()
          }}
        >
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default ChangeNameImageMedia

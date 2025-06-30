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
import { useCreateFolderMediaQueryOption } from '@/queryOptions/form/formQueryOptions'

interface confirmProps {
  id: string
  onClick?: () => void
  data?: any
}

const CreateFolderMedia = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()
  const { dictionary } = useDictionary()
  const [folderName, setFolderName] = useState('')
  const { mutateAsync: callCreateFolder } = useCreateFolderMediaQueryOption()

  const handleSubmit = async () => {
    if (!folderName) {
      toast.error('ต้องกรอกชื่อโฟลเดอร์', { autoClose: 3000 })

      return
    }
    try {
      const response = await callCreateFolder({ name: folderName, parent_id: data })
      if (response?.code == 'SUCCESS') {
        toast.success('สร้างโฟลเดอร์สำเร็จ', { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (error: any) {
      console.log('error', error)

      if (error?.code === 'CREATE_MEDIA_FOLDER_ERROR') {
        toast.error('ชื่อโฟลเดอร์ซ้ำ', { autoClose: 3000 })
      } else {
        toast.error('สร้างโฟลเดอร์ล้มเหลว', { autoClose: 3000 })
      }
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>สร้างโฟลเดอร์</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField
          fullWidth
          type='text'
          label='ตั้งชื่อโฟลเดอร์'
          placeholder='ตั้งชื่อ'
          value={folderName}
          onChange={e => setFolderName(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='outlined'
          onClick={() => {
            closeDialog(id)
          }}
        >
          {/* {dictionary?.cancel} */}
          {dictionary?.cancel}
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            handleSubmit()
          }}
        >
          {/* {dictionary?.confirm} */}
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default CreateFolderMedia

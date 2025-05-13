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

interface confirmProps {
  id: string
  onClick?: () => void
  data: any
}

const ChangeNameImgFormMedia = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()
  const { dictionary } = useDictionary()
  const [newName, setNewName] = useState('')

  const handleSubmit = async () => {
    closeDialog(id)
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>แก้ไขชื่อไฟล์</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField fullWidth type='text' label='แก้ไขชื่อไฟล์เก่า' placeholder='' disabled value={data ?? ''} />
      </Grid>

      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField
          fullWidth
          type='text'
          label='แก้ไขชื่อไฟล์ใหม่'
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
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            handleSubmit()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default ChangeNameImgFormMedia

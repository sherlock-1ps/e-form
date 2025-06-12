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
}

const UserCreateTaskDialog = ({ id, onClick }: confirmProps) => {
  const { closeDialog } = useDialog()
  const { dictionary } = useDictionary()

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>fefefef</Typography>
      </Grid>
    </Grid>
  )
}

export default UserCreateTaskDialog

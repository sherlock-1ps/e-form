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

const RenameAccountDialog = ({ id, onClick, data }: confirmProps) => {
  const { closeDialog } = useDialog()
  const { dictionary } = useDictionary()
  const [role, setRole] = useState('')
  const { mutateAsync: changeRoleAccountOwner } = useChangeRoleAccountOwnerMutationOption()
  const { data: roleListData, isPending: pendingRole } = useFetchRoleQueryOption()

  const handleSubmit = async () => {
    try {
      const result = await changeRoleAccountOwner({ role_id: role, operator_user_id: data?.operator_user_id })

      if (result?.code == 'SUCCESS') {
        toast.success(dictionary['role']?.changeRoleSuccess, { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (error) {
      console.log('error', error)
      toast.error(dictionary['role']?.changeRoleFailed, { autoClose: 3000 })
    }
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{dictionary['role']?.changeRole}</Typography>
      </Grid>
      <Divider />
      <Grid item xs={12} className='flex gap-4'>
        <CustomTextField fullWidth type='text' label='Old Role' placeholder='' disabled value={data?.role_name} />
        <CustomTextField
          select
          fullWidth
          value={role}
          onChange={e => setRole(e.target.value)}
          label={dictionary['role']?.newRole}
          disabled={pendingRole}
        >
          <MenuItem value='' disabled>
            {dictionary['role']?.selectRole}
          </MenuItem>

          {roleListData?.code === 'SUCCESS' &&
            roleListData.data.map((item: any, idx: number) => (
              <MenuItem value={item.role_id} key={idx} className='capitalize'>
                {item.role_name}
              </MenuItem>
            ))}
        </CustomTextField>
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

export default RenameAccountDialog

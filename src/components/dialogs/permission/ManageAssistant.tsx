'use client'
import { useState } from 'react'

import { Box, Button, DialogActions, Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CardAssistantList from '@/components/card-statistics/CardAssistantList'
import { updateUserToRole } from '@/app/server/pages/role/roleActions'

type PermissionDialogProps = {
  data?: any
  id: string
  role_id: number | string
}

type DataType = {
  id: string
  username: string
  phone_number: string
  avatar?: string
}

const newDataAssistant = [
  { key: '1', name: 'บอสพอล', profession: '095-555-4445', totalCourses: 33, avatar: '/images/avatars/1.png' },
  {
    key: '2',
    name: 'บอสกัน',
    profession: 'Digital Marketing',
    totalCourses: 52,
    avatar: '/images/avatars/2.png'
  },
  {
    key: '3',
    name: 'บอสนาย',
    profession: 'UI/UX Design',
    totalCourses: 12,
    avatar: '/images/avatars/3.png'
  },
  { key: '4', name: 'บอสแซม', profession: 'Vue', totalCourses: 8, avatar: '/images/avatars/4.png' },
  { key: '5', name: 'บอสมีน', profession: 'React Native', totalCourses: 9, avatar: '/images/avatars/3.png' },
  { key: '6', name: 'บอสนิน', profession: 'Java Developer', totalCourses: 10, avatar: '/images/avatars/6.png' }
]

const ManageAssistantDialog = ({ id, data, role_id }: PermissionDialogProps) => {
  const { closeDialog } = useDialog()

  const [addDataAssistant, setAddDataAssistant] = useState<DataType[]>(data?.users_in_role)
  const [delDataAssistant, setDelDataAssistant] = useState<DataType[]>(data?.users_out_of_role)

  const handleDelAssistant = (item: any) => {
    setDelDataAssistant(prev => prev.filter(assistant => assistant.id !== item.id))
    setAddDataAssistant(prev => [item, ...prev])
  }

  const handleAddAssistant = (item: any) => {
    setDelDataAssistant(prev => [item, ...prev])
    setAddDataAssistant(prev => prev.filter(assistant => assistant.id !== item.id))
  }

  const handleSaveUpdateUserManagement = async (
    id: string,
    role_id: number | string,
    addUser: DataType[],
    delUser: DataType[]
  ) => {
    const add_user_list = addUser
      .filter(item => !data.users_in_role.some((d: any) => d.id === item.id))
      .map(item => item.id)

    const removed_user_list = delUser
      .filter(item => data.users_in_role.some((d: any) => d?.id === item?.id))
      .map(item => item?.id)

    await updateUserToRole({ role_id, removed_user_list, add_user_list })
    closeDialog(id)
  }

  return (
    <Box>
      <Typography variant='h4' className='flex flex-col gap-2 text-center p-6'>
        Manage Assistants
      </Typography>
      <Grid container xs={12} spacing={0}>
        <Grid item xs>
          <CardAssistantList
            mode={'add'}
            title='Assistants in Role'
            data={data?.users_in_role}
            handleSelected={handleAddAssistant}
            selectedData={addDataAssistant}
          />
        </Grid>
        <Grid item xs='auto' className='mx-4 max-sm:hidden max-md:block'>
          <Divider className='border-dashed' orientation='vertical' />
        </Grid>
        <Grid item xs>
          <CardAssistantList
            mode={'del'}
            title='Other Assistants'
            data={data?.users_out_of_role}
            handleSelected={handleDelAssistant}
            selectedData={delDataAssistant}
          />
        </Grid>
      </Grid>
      <DialogActions className='flex max-sm:flex-col max-sm:items-center max-sm:gap-2 justify-end pbs-0 sm:pli-16 mt-4'>
        <Button
          onClick={() => closeDialog(id)}
          variant='tonal'
          color='secondary'
          className='max-sm:mis-0 max-sm:w-full'
        >
          Cancel
        </Button>
        {/* <Button variant='outlined' onClick={() => {}} className='max-sm:mis-0 max-sm:w-full'>
          RESET
        </Button> */}

        <Button
          variant='contained'
          disabled={
            data?.users_in_role.length == addDataAssistant.length ||
            data?.users_out_of_role.length == delDataAssistant.length
          }
          onClick={() => {
            handleSaveUpdateUserManagement(id, role_id, addDataAssistant, delDataAssistant)
          }}
          className='max-sm:mis-0 max-sm:w-full'
        >
          SAVE
        </Button>
      </DialogActions>
    </Box>
  )
}

export default ManageAssistantDialog

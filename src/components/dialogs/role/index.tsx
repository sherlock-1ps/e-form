// MUI Imports
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Component Imports
import { Box, Grid, MenuItem, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'
import { useDialog } from '@/hooks/useDialog'
import type { RoleListType } from '@/types/pages/role/roleTypes'
import { createRole, updateRole } from '@/app/server/pages/role/roleActions'

// Shared Schema for Validation
const schema = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  description: z.string().min(1, { message: 'This field is required' }),
  icon: z.number({ invalid_type_error: 'This field is required' })
})

// Form Values Type
type FormValues = {
  name: string
  description: string
  icon: string | number
}

type RoleDialogProps = {
  data?: RoleListType
  id: string
}

const icons = [1, 2, 3, 4, 5]

// Generic Form Content Component for Add and Edit
const RoleFormContent = ({
  control,
  errors,
  onSubmit,
  handleClose,
  id,
  watchFields,
  data
}: {
  control: any
  errors: any
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  handleClose: (id: string) => void
  id: string
  watchFields?: any
  data?: RoleListType
}) => {
  // Check if form has changed (only used in edit mode)
  const isFormChanged = data
    ? watchFields[0] !== data.name || watchFields[1] !== data.description || watchFields[2] !== data.icon
    : true

  return (
    <form onSubmit={onSubmit}>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <Grid container spacing={2}>
          <Grid item xs={'auto'}>
            <Controller
              name='icon'
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <CustomTextField
                  select
                  label='Icon'
                  variant='outlined'
                  {...field}
                  {...(errors.icon && {
                    error: true,
                    helperText: errors?.icon?.message
                  })}
                >
                  {icons.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid item xs>
            <Controller
              name='name'
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  label='Role Name'
                  variant='outlined'
                  placeholder='Enter Role'
                  {...field}
                  {...(errors.name && {
                    error: true,
                    helperText: errors?.name?.message
                  })}
                />
              )}
            />
          </Grid>
        </Grid>

        <Controller
          name='description'
          rules={{ required: true }}
          control={control}
          render={({ field }) => (
            <CustomTextField
              rows={3}
              multiline
              fullWidth
              label='Description'
              {...field}
              {...(errors.description && {
                error: true,
                helperText: errors?.description?.message
              })}
            />
          )}
        />
      </DialogContent>
      <DialogActions className='flex max-sm:flex-col max-sm:items-center max-sm:gap-2 justify-end pbs-0 sm:pli-16'>
        <Button
          onClick={() => handleClose(id)}
          variant='tonal'
          color='secondary'
          className='max-sm:mis-0 max-sm:w-full'
        >
          CLOSE
        </Button>
        <Button
          type='submit'
          variant='contained'
          className='max-sm:mis-0 max-sm:w-full'
          disabled={data ? !isFormChanged : false}
        >
          {data ? 'EDIT' : 'CREATE'}
        </Button>
      </DialogActions>
    </form>
  )
}

// AddContent Component
const AddContent = ({ handleClose, id }: { handleClose: (id: string) => void; id: string }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      icon: ''
    }
  })

  const onSubmit = async (formData: FormValues) => {
    // await createRole(formData)
    reset()
    handleClose(id)
  }

  return (
    <RoleFormContent
      control={control}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      handleClose={handleClose}
      id={id}
    />
  )
}

// EditContent Component
const EditContent = ({
  handleClose,
  data,
  id
}: {
  handleClose: (id: string) => void
  data: RoleListType
  id: string
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.name,
      description: data.description,
      icon: data.icon
    }
  })

  const watchFields = watch(['name', 'description', 'icon'])

  const onSubmit = async (formData: FormValues) => {
    const payload = {
      ...formData,
      role_id: data?.id
    }

    // await updateRole(payload)
    reset()
    handleClose(id)
  }

  return (
    <RoleFormContent
      control={control}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      handleClose={handleClose}
      id={id}
      watchFields={watchFields}
      data={data}
    />
  )
}

const RoleDialog = ({ id, data }: RoleDialogProps) => {
  const { closeDialog } = useDialog()

  return (
    <Box>
      <Typography variant='h4' className='flex flex-col gap-2 text-center p-6'>
        {data ? 'Edit Role' : 'Create a new role'}
      </Typography>
      {data ? (
        <EditContent handleClose={closeDialog} data={data} id={id} />
      ) : (
        <AddContent handleClose={closeDialog} id={id} />
      )}
    </Box>
  )
}

export default RoleDialog

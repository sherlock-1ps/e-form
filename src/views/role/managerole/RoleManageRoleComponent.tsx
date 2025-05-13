'use client'

import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import PermissionList from './PermissionList'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify'
import PermissionListEdit from './PermissionListEdit'
import { useDictionary } from '@/contexts/DictionaryContext'
import { useCreateRoleMutationOption, useEditPermissionMutationOption } from '@/queryOptions/role/roleQueryOptions'

const RoleManageRoleComponent = () => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const { lang: locale } = useParams()
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const roleResult = role ? JSON.parse(decodeURIComponent(role as string)) : null

  const { mutateAsync: callCreateRole, isPending: pendingCreateRole } = useCreateRoleMutationOption()

  const { mutateAsync: callEditRole, isPending: pendingEditRole } = useEditPermissionMutationOption()

  const schema = z.object({
    roleName: z.string().min(1, dictionary['role']?.roleNameRequired),
    description: z.string().min(1, dictionary['role']?.roleDesRequired),
    permissions: z.array(z.string()).min(1, dictionary['role']?.permissionRequired),
    role_id: z.string().optional()
  })
  const formMethods = useForm<RoleFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleName: roleResult?.role_name || '',
      description: roleResult?.description || ''
    }
  })

  type RoleFormType = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = formMethods

  const onSubmit = async (data: RoleFormType) => {
    if (roleResult) {
      if (pendingEditRole) {
        return
      } else {
        handleUpdateRole(data)

        return
      }
    }

    try {
      if (pendingCreateRole) return
      const response = await callCreateRole({
        role_name: data.roleName,
        description: data.description,
        permissions: data.permissions
      })
      if (response?.code == 'SUCCESS') {
        toast.success(dictionary?.createSuccess, { autoClose: 3000 })
        router.push(`/${locale}/role`)
      }
    } catch (error) {
      console.log('error', error)
      toast.error(dictionary?.createFailed, { autoClose: 3000 })
    }
  }

  const handleUpdateRole = async (data: RoleFormType) => {
    try {
      const response = await callEditRole({
        role_id: data.role_id ?? '',
        role_name: data.roleName,
        description: data.description,
        permissions: data.permissions
      })
      if (response?.code == 'SUCCESS') {
        toast.success(dictionary['role']?.updateRoleSuccess, { autoClose: 3000 })
        router.push(`/${locale}/role`)
      }
    } catch (error) {
      console.log('error', error)
      toast.error(dictionary['role']?.updateRoleFailed, { autoClose: 3000 })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Grid container className='flex flex-col gap-6'>
              <Grid item xs={12} sm className='flex gap-2 justify-between'>
                <Typography variant='h5' className='text-nowrap'>
                  {roleResult ? 'Edit Role' : dictionary['role']?.createRole}
                </Typography>
              </Grid>

              <Divider />

              <Grid container alignItems='start' className='flex gap-6'>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    label={dictionary['role']?.roleName}
                    {...register('roleName')}
                    error={!!errors.roleName}
                    helperText={errors.roleName?.message}
                  />
                </Grid>

                <Grid item xs={12} sm>
                  <CustomTextField
                    fullWidth
                    label={dictionary['description']}
                    {...register('description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='h6'>{dictionary['role']?.permission}</Typography>
              </Grid>

              <Grid item xs={12}>
                {roleResult ? <PermissionListEdit {...roleResult} /> : <PermissionList />}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  )
}

export default RoleManageRoleComponent

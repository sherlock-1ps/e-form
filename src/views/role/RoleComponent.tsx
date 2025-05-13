/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RoleTable from './RoleTable'
import { useDictionary } from '@/contexts/DictionaryContext'
import {
  useDeleteRoleMutationOption,
  useFetchRoleQueryOption,
  useSearchRoleListMutationOption,
  useUpdateStatusRoleMutationOption
} from '@/queryOptions/role/roleQueryOptions'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useHasPermission } from '@/hooks/useHasPermission'

const RoleComponent = () => {
  const queryClient = useQueryClient()
  const { dictionary } = useDictionary()
  const { hasPermission } = useHasPermission()
  const router = useRouter()
  const params = useParams()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Vars
  const { lang: locale } = params

  const {
    data: roleData,
    isPending: pendingRole,
    error: errorRoleData,
    refetch
  } = useFetchRoleQueryOption(page, pageSize)

  const {
    mutate: callSearchRole,
    data: searchRoleData,
    isPending: pendingSearchRole,
    reset
  } = useSearchRoleListMutationOption()

  const { mutate: updateStatusRole } = useUpdateStatusRoleMutationOption()

  const { mutate: deleteRole } = useDeleteRoleMutationOption()

  const handleSearch = async () => {
    if (!search.trim()) return
    setIsSearching(true)
    setPage(1)
    callSearchRole({ role_name: search, page: 1, pageSize })
  }

  const handleRefetchData = (role_id: string, is_enable: boolean) => {
    updateStatusRole(
      { role_id, is_enable },
      {
        onSuccess: () => {
          if (searchRoleData) {
            callSearchRole({ role_name: search, page, pageSize })
          } else {
            queryClient.invalidateQueries({ queryKey: ['roleList'] })
          }
          toast.success(dictionary?.updateSuccess, { autoClose: 3000 })
        },
        onError: error => {
          toast.error(dictionary?.updatefailed, { autoClose: 3000 })
        }
      }
    )
  }

  const handleDeleteRole = (role_id: string) => {
    deleteRole(
      { role_id },
      {
        onSuccess: () => {
          if (searchRoleData) {
            callSearchRole({ role_name: search, page, pageSize })
          } else {
            queryClient.invalidateQueries({ queryKey: ['roleList'] })
          }
          toast.success(dictionary?.updateSuccess, { autoClose: 3000 })
        },
        onError: error => {
          toast.error(dictionary?.updatefailed, { autoClose: 3000 })
        }
      }
    )
  }

  useEffect(() => {
    if (!isSearching) {
      queryClient.invalidateQueries({ queryKey: ['roleList'] })
    } else if (!searchRoleData) {
      return
    } else {
      callSearchRole({ role_name: search, page, pageSize })
    }
  }, [page, pageSize])

  useEffect(() => {
    if (!search && searchRoleData) {
      setPage(1)
      setIsSearching(false)
      reset()
      refetch()
    }
  }, [search])

  return (
    <Card>
      <CardContent>
        <Grid container className='flex flex-col gap-6'>
          <Grid item xs={12} sm className='flex gap-2 justify-between'>
            <Typography variant='h5' className=' text-nowrap'>
              {dictionary['role']?.titleRole}
            </Typography>
            {hasPermission('create-operator-22') && (
              <Button
                variant='contained'
                onClick={() => {
                  router.push(`/${locale}/role/managerole`)
                }}
              >
                {dictionary['role']?.createRole}
              </Button>
            )}
          </Grid>
          <Divider />
          <Grid container alignItems='end' className='flex gap-6'>
            <Grid item xs={12} sm>
              <CustomTextField
                fullWidth
                value={search}
                label={'Role'}
                onChange={e => setSearch(e.target.value)}
                placeholder={dictionary['role']?.searchRole}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => {}}>
                        <i className='tabler-search' />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm>
              <Button variant='contained' onClick={handleSearch}>
                {dictionary['search']}
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {(pendingRole || pendingSearchRole) && <p>{dictionary['loading']}....</p>}

            {errorRoleData && <Typography className=' text-error'>{errorRoleData.message}</Typography>}

            {roleData?.code == 'SUCCESS' && !pendingRole && !pendingSearchRole && (
              <RoleTable
                data={searchRoleData?.data || roleData?.data || { list: [] }}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                onUpdateStatus={handleRefetchData}
                onDeleteRole={handleDeleteRole}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default RoleComponent

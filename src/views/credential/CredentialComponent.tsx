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
import { fetchOperatorQueryOption } from '@/queryOptions/operator/operatorQueryOptions'
import { useDictionary } from '@/contexts/DictionaryContext'
import {
  fetchCredentialQueryOption,
  useSearchCredentialMutationOption,
  useUpdateCredentialMutationOption
} from '@/queryOptions/credential/credentialQueryOptions'
import CredentialListTable from './CredentialListTable'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useHasPermission } from '@/hooks/useHasPermission'

const CredentialComponent = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const { dictionary } = useDictionary()
  const { hasPermission } = useHasPermission()

  // Vars
  const { lang: locale } = params

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: credentialData,
    isPending: pendingCredentialData,
    error: errorCredentialData,
    refetch
  } = fetchCredentialQueryOption(page, pageSize)

  const {
    mutate: searchCredential,
    data: searchCredentialData,
    isPending: pendingSearchCredentialData,
    reset
  } = useSearchCredentialMutationOption()

  const { mutate: updateStatusCredential } = useUpdateCredentialMutationOption()

  const handleRefetchData = (credential_id: string, is_enable: boolean) => {
    updateStatusCredential(
      { credential_id, is_enable },
      {
        onSuccess: () => {
          if (searchCredentialData) {
            searchCredential({ credential_prefix: search, page, pageSize })
          } else {
            queryClient.invalidateQueries({ queryKey: ['credentials'] })
          }

          toast.success(dictionary?.updateSuccess, { autoClose: 3000 })
        },
        onError: error => {
          toast.error(dictionary?.updatefailed, { autoClose: 3000 })
        }
      }
    )
  }

  const handleSearch = () => {
    if (!search.trim()) return
    setIsSearching(true)
    setPage(1)
    searchCredential({ credential_prefix: search, page: 1, pageSize })
  }

  useEffect(() => {
    if (!isSearching) {
      queryClient.invalidateQueries({ queryKey: ['credentials'] })
    } else if (!searchCredentialData) {
      return
    } else {
      searchCredential({ credential_prefix: search, page, pageSize })
    }
  }, [page, pageSize])

  useEffect(() => {
    if (!search && searchCredentialData) {
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
              {dictionary['credential']?.titleCredential}
            </Typography>
            {hasPermission('create-operator-17') && (
              <Button
                variant='contained'
                onClick={() => {
                  router.push(`/${locale}/credential/create`)
                }}
              >
                {dictionary['credential']?.createCredential}
              </Button>
            )}
          </Grid>
          <Divider />
          <Grid container alignItems='end' className='flex gap-6'>
            <Grid item xs={12} sm>
              <CustomTextField
                fullWidth
                value={search}
                label={dictionary['prefix']}
                onChange={e => setSearch(e.target.value)}
                placeholder={dictionary['searchPrefix']}
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

            <Button variant='contained' onClick={handleSearch}>
              {dictionary['search']}
            </Button>
          </Grid>
          {(pendingCredentialData || pendingSearchCredentialData) && <p>{dictionary['loading']}....</p>}
          {errorCredentialData && <Typography className=' text-error'>{errorCredentialData.message}</Typography>}
          {credentialData?.code == 'SUCCESS' && !pendingSearchCredentialData && !pendingCredentialData && (
            <Grid item xs={12}>
              <CredentialListTable
                data={searchCredentialData?.data || credentialData?.data || { list: [] }}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                onUpdateStatus={handleRefetchData}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CredentialComponent

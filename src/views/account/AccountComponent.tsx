/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import AccountTable from './AccountTable'
import { useDictionary } from '@/contexts/DictionaryContext'
import {
  useFetchAccountQueryOption,
  useSearchAccountQueryOption,
  useUpdateStatusAccountQueryOption
} from '@/queryOptions/account/accountQueryOptions'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useHasPermission } from '@/hooks/useHasPermission'

const AccountComponent = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const { hasPermission } = useHasPermission()
  // Vars
  const { lang: locale } = params
  const { dictionary } = useDictionary()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: accountData,
    isPending: pendingAccount,
    error: errorAccountData,
    refetch
  } = useFetchAccountQueryOption(page, pageSize)

  const {
    mutate: callSearchAccount,
    data: searchAccountData,
    isPending: pendingSearchAccount,
    reset
  } = useSearchAccountQueryOption()

  const { mutate: updateStatusAccount } = useUpdateStatusAccountQueryOption()

  const handleSearch = async () => {
    if (!search.trim()) return
    setIsSearching(true)
    setPage(1)
    callSearchAccount({ email: search, page: 1, pageSize })
  }

  const handleRefetchData = (operator_user_id: string, is_enable: boolean) => {
    updateStatusAccount(
      { operator_user_id, is_enable },
      {
        onSuccess: () => {
          if (searchAccountData) {
            callSearchAccount({ email: search, page, pageSize })
          } else {
            queryClient.invalidateQueries({ queryKey: ['account'] })
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
      queryClient.invalidateQueries({ queryKey: ['account'] })
    } else if (!searchAccountData) {
      return
    } else {
      callSearchAccount({ email: search, page, pageSize })
    }
  }, [page, pageSize])

  useEffect(() => {
    if (!search && searchAccountData) {
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
              {dictionary['account']?.titleAccount}
            </Typography>
            {hasPermission('create-operator-21') && (
              <Button
                variant='contained'
                onClick={() => {
                  router.push(`/${locale}/account/create`)
                }}
              >
                {dictionary['account']?.createAccount}
              </Button>
            )}
          </Grid>
          <Divider />
          <Grid container alignItems='end' className='flex gap-6'>
            <Grid item xs={12} sm>
              <CustomTextField
                fullWidth
                value={search}
                label={dictionary['email']}
                onChange={e => setSearch(e.target.value)}
                placeholder={dictionary['searchEmail']}
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

            <Button
              variant='contained'
              onClick={() => {
                handleSearch()
              }}
            >
              {dictionary['search']}
            </Button>
          </Grid>
          <Grid item xs={12}>
            {(pendingAccount || pendingSearchAccount) && <p>{dictionary['loading']}....</p>}

            {errorAccountData && <Typography className=' text-error'>{errorAccountData.message}</Typography>}

            {accountData?.code == 'SUCCESS' && !pendingAccount && !pendingSearchAccount && (
              <AccountTable
                data={searchAccountData?.data || accountData?.data || { list: [] }}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                onUpdateStatus={handleRefetchData}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AccountComponent

/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import { Button, Card, CardContent, Divider, IconButton, InputAdornment } from '@mui/material'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

import { useParams, useSearchParams } from 'next/navigation'
import CustomTextField from '@/@core/components/mui/TextField'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { searchGameProviders } from '@/app/sevices/provider/provider'
import { fetchGamesProviderQueryOption } from '@/queryOptions/provider/providerQueryOptions'
import { useDialog } from '@/hooks/useDialog'
import AddGameDialog from '@/components/dialogs/provider/AddGameDialog'
import { useDictionary } from '@/contexts/DictionaryContext'
import SelectedProviderTable from './SelectedProviderTable'
import {
  useFetchGameCredentialListQueryOption,
  useFetchGameProviderListQueryOption,
  useSearchGameCredentialListQueryOption,
  useUpdateStatusGameCredentialListQueryOption
} from '@/queryOptions/credential/credentialQueryOptions'
import { toast } from 'react-toastify'
import { useHasPermission } from '@/hooks/useHasPermission'

const SelectedProviderComponent = () => {
  const queryClient = useQueryClient()
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const { hasPermission } = useHasPermission()
  const searchParams = useSearchParams()
  const params = useParams()

  const gamePath = searchParams.get('game')

  const gameData = gamePath ? JSON.parse(decodeURIComponent(gamePath as string)) : null

  const providerCredential = encodeURIComponent(JSON.stringify(gameData))
  // Vars
  const { lang: locale } = params
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: gameProvider,
    isPending: pendingGameProvider,
    error: errorGameProvider,
    refetch
  } = useFetchGameProviderListQueryOption({
    page,
    pageSize,
    provider_credential_id: gameData?.provider_credential_id ?? ''
  })

  const {
    mutate: callSearchGame,
    data: searchGameProvider,
    isPending: isSearchingPending,
    error: searchError,
    reset
  } = useSearchGameCredentialListQueryOption()

  const { mutate: callUpdateStatus } = useUpdateStatusGameCredentialListQueryOption()

  const handleSearch = (search: string) => {
    if (!search.trim()) return
    setIsSearching(true)
    setPage(1)
    callSearchGame({
      provider_credential_id: gameData?.provider_credential_id ?? '',
      page: 1,
      pageSize,
      game_name: search
    })
  }

  const handleUpdateStatus = (game_credential_id: string, is_enable: boolean) => {
    callUpdateStatus(
      { game_credential_id, is_enable },
      {
        onSuccess: () => {
          if (searchGameProvider) {
            callSearchGame({
              provider_credential_id: gameData?.provider_credential_id ?? '',
              page,
              pageSize,
              game_name: search
            })
          } else {
            queryClient.invalidateQueries({ queryKey: ['gameProvider'] })
          }

          toast.success(dictionary?.updateSuccess, { autoClose: 3000 })
        },
        onError: error => {
          toast.error(dictionary?.updatefailed, { autoClose: 3000 })
          console.error('Failed to update game status', error)
        }
      }
    )
  }

  useEffect(() => {
    if (!isSearching) {
      queryClient.invalidateQueries({ queryKey: ['gameProvider'] })
    } else if (!searchGameProvider) {
      return
    } else {
      callSearchGame({
        provider_credential_id: gameData?.provider_credential_id ?? '',
        page,
        pageSize,
        game_name: search
      })
    }
  }, [page, pageSize])

  useEffect(() => {
    if (!search && searchGameProvider) {
      setPage(1)
      setIsSearching(false)
      reset()
      refetch()
    }
  }, [search])

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['gameProvider'] })
    }
  }, [])

  return (
    <div className='flex flex-col gap-6'>
      <Grid container spacing={6} className='flex sm:flex-col md:flex-row'>
        <Grid item xs={12}>
          <Card>
            <CardContent className='flex flex-col gap-6'>
              <div className='flex gap-2 items-center w-full'>
                <Link href={`/${locale}/credential`} className='flex gap-2 items-center'>
                  <i className='tabler-share text-[20px] text-primary' />
                  <Typography variant='h6' color={'primary'}>
                    Credential List
                  </Typography>
                </Link>
                /
                <Link
                  href={`/${locale}/credential/provider?provider=${providerCredential}`}
                  className='flex gap-2 items-center'
                >
                  <i className='tabler-crown text-[20px] text-primary' />
                  <Typography variant='h6' className='text-primary'>
                    Provider List ({gameData?.credential_prefix})
                  </Typography>
                </Link>
                /<Typography variant='h6'>{gameData?.provider_name}</Typography>
              </div>

              <div className='flex gap-6 h-[80px] justify-between items-center'>
                <div className='flex gap-6'>
                  <img
                    src={gameData?.image}
                    className='w-[80px] h-full rounded-md overflow-hidden'
                    alt='logoProvider'
                  />
                  <div className='flex flex-col justify-between'>
                    <Typography variant='h2' className=' capitalize'>
                      {gameData?.provider_name}
                    </Typography>

                    <Typography color={'secondary'}>{gameData?.provider_credential_id}</Typography>
                  </div>
                </div>
              </div>

              <Divider />

              <div className='flex gap-2 items-center justify-between'>
                <div className='w-full'>
                  <CustomTextField
                    fullWidth
                    value={search}
                    label={dictionary?.gameName}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={dictionary?.searchGame}
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
                </div>

                <div className=' flex gap-2 self-end'>
                  <Button
                    variant='contained'
                    onClick={() => {
                      handleSearch(search)
                    }}
                  >
                    {dictionary?.search ?? 'Search'}
                  </Button>
                </div>
              </div>
              {pendingGameProvider && <p> {dictionary?.loading ?? 'Loading'}....</p>}
              {errorGameProvider && (
                <Typography className='text-error'>
                  Error fetching games providers: {errorGameProvider.message}
                </Typography>
              )}
              {isSearchingPending && <Typography> {dictionary?.searching ?? 'Searching'} providers...</Typography>}
              {searchError && <Typography className='text-error'>Error searching: {searchError.message}</Typography>}
              {gameProvider?.code == 'SUCCESS' && !pendingGameProvider && !isSearchingPending && (
                <SelectedProviderTable
                  data={searchGameProvider?.data || gameProvider?.data || { list: [] }}
                  page={page}
                  pageSize={pageSize}
                  setPage={setPage}
                  setPageSize={setPageSize}
                  onStatusUpdated={handleUpdateStatus}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default SelectedProviderComponent

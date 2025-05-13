// MUI Imports
'use client'

import { Button, Card, CardContent, Divider, IconButton, InputAdornment } from '@mui/material'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'

import { useParams, useSearchParams } from 'next/navigation'
import CustomTextField from '@/@core/components/mui/TextField'
import Link from 'next/link'
import { useState } from 'react'
import ProviderNameTable from './ProviderNameTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { searchGameProviders } from '@/app/sevices/provider/provider'
import { fetchGamesProviderQueryOption } from '@/queryOptions/provider/providerQueryOptions'
import { useDialog } from '@/hooks/useDialog'
import AddGameDialog from '@/components/dialogs/provider/AddGameDialog'

const ProviderNameComponent = () => {
  const { showDialog } = useDialog()
  const searchParams = useSearchParams()
  const provider = searchParams.get('provider')
  const providerName = searchParams.get('providerName')
  const providerImg = searchParams.get('providerImg')
  const params = useParams()

  // Vars
  const { lang: locale } = params
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(1)

  const {
    data: gamesProviderData,
    isPending: pendingGamesProvider,
    error: errorGamesProvider,
    refetch
  } = useQuery(fetchGamesProviderQueryOption(page, pageSize, provider || ''))

  const {
    mutate,
    data: searchResults,
    isPending: isSearchingPending,
    error: searchError,
    reset
  } = useMutation({
    mutationFn: searchGameProviders
  })

  const handleSearch = (search: string) => {
    setPage(1)
    mutate({ page: 1, pageSize, provider_code: provider ?? '', game_name: search })
  }

  const handleReset = () => {
    setPage(1)
    setSearch('')
    reset()
    refetch()
  }

  return (
    <div className='flex flex-col gap-6'>
      <Grid container spacing={6} className='flex sm:flex-col md:flex-row'>
        <Grid item xs={12}>
          <Card>
            <CardContent className='flex flex-col gap-6'>
              <div className='flex gap-2 items-center w-full'>
                <Link href={`/${locale}/providers`} className='flex gap-2 items-center'>
                  <i className='tabler-crown text-[25px] text-primary' />
                  <Typography variant='h6' color={'primary'}>
                    Provider List
                  </Typography>
                </Link>
                /<Typography variant='h6'>{providerName}</Typography>
              </div>

              <div className='flex gap-6 h-[80px] justify-between items-center'>
                <div className='flex gap-6'>
                  <img
                    src={providerImg || '/images/avatars/1.png'}
                    className='w-[80px] h-full rounded-md overflow-hidden'
                    alt='logoProvider'
                  />
                  <div className='flex flex-col justify-between'>
                    <Typography variant='h2' className=' capitalize'>
                      {providerName}
                    </Typography>

                    <Typography color={'secondary'}>{provider}</Typography>
                  </div>
                </div>
                <Button
                  variant='contained'
                  onClick={() => {
                    showDialog({
                      id: 'AddGameDialog',
                      component: (
                        <AddGameDialog
                          id='AddGameDialog'
                          data={gamesProviderData?.data}
                          providerCode={provider ?? ''}
                          onClick={() => {}}
                        />
                      ),
                      size: 'sm'
                    })
                  }}
                >
                  Add Game
                </Button>
              </div>

              <Divider />

              <div className='flex gap-2 items-center justify-between'>
                <div>
                  {/* <DebouncedInput
                    value={search}
                    placeholder='Search Game'
                    onChange={e => setSearch(e.target.value)}
                    className='w-full'
                    isIcon={true}
                  /> */}
                  <CustomTextField
                    value={search}
                    label='Game Name'
                    onChange={e => setSearch(e.target.value)}
                    placeholder='Search game'
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

                <div className=' flex gap-2'>
                  <Button
                    variant='contained'
                    onClick={() => {
                      handleSearch(search)
                    }}
                  >
                    Search
                  </Button>
                  <Button variant='outlined' onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
              {pendingGamesProvider && <p>Loading....</p>}
              {errorGamesProvider && (
                <Typography className='text-error'>
                  Error fetching games providers: {errorGamesProvider.message}
                </Typography>
              )}
              {isSearchingPending && <Typography>Searching providers...</Typography>}
              {searchError && <Typography className='text-error'>Error searching: {searchError.message}</Typography>}
              {gamesProviderData?.code == 'SUCCESS' && (
                <ProviderNameTable
                  data={searchResults?.data || gamesProviderData?.data}
                  page={page}
                  pageSize={pageSize}
                  setPage={setPage}
                  setPageSize={setPageSize}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default ProviderNameComponent

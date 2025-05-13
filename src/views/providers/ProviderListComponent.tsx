/* eslint-disable react-hooks/exhaustive-deps */
// MUI Imports
'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { useMutation, useQuery } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import ProviderListTable from './ProviderListTable'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchProviders } from '@/app/sevices/provider/provider'
import fetchProviderQueryOption, { fetchProviderTypeQueryOption } from '@/queryOptions/provider/providerQueryOptions'

const ProviderListComponent = () => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(1)

  const [isSearching, setIsSearching] = useState(false)

  const {
    data: providersData,
    isPending: pendingProvider,
    error: errorProvider,
    refetch
  } = useQuery(fetchProviderQueryOption(page, pageSize))

  const { data: typeProvider, isPending: pendingType } = useQuery(fetchProviderTypeQueryOption())

  const {
    mutate,
    data: searchResults,
    isPending: isSearchingPending,
    error: searchError
  } = useMutation({
    mutationFn: searchProviders
  })

  const handleSearch = () => {
    setPage(1)
    setIsSearching(true)
    mutate({ page: 1, pageSize, search, type })
  }

  const handleReset = () => {
    setPage(1)
    setIsSearching(false)
    setSearch('')
    setType('all')
    refetch()
  }

  return (
    <Card>
      <CardContent>
        <Grid container className='flex flex-col gap-6'>
          <Grid item xs={12} sm className='flex gap-2 justify-between'>
            <Typography variant='h5' className=' text-nowrap'>
              Provider List
            </Typography>
            <Button
              variant='contained'
              onClick={() => {
                router.push(`/${locale}/providers/addprovider`)
              }}
            >
              Add New Provider
            </Button>
          </Grid>
          <Divider />
          <Grid container spacing={4} alignItems='end'>
            <Grid item xs={12} md={3}>
              <CustomTextField
                value={search}
                label='Provider Name'
                onChange={e => setSearch(e.target.value)}
                placeholder='Search provider'
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
            <Grid item xs={12} md={3}>
              <CustomTextField
                select
                fullWidth
                value={type}
                defaultValue={'all'}
                onChange={e => setType(e.target.value)}
                label='Select Type'
                disabled={pendingType}
              >
                {typeProvider?.code === 'SUCCESS'
                  ? [
                      <MenuItem value='all' key='all' className='capitalize'>
                        All
                      </MenuItem>,
                      ...typeProvider?.data?.provider_type.map((item: any, idx: number) => (
                        <MenuItem value={item} key={idx} className='capitalize'>
                          {item}
                        </MenuItem>
                      ))
                    ]
                  : [
                      <MenuItem value='all' key='all'>
                        All
                      </MenuItem>
                    ]}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={4} className='flex gap-4'>
              <Button variant='contained' onClick={handleSearch}>
                Search
              </Button>
              <Button variant='outlined' onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {pendingProvider && <Typography>Loading providers...</Typography>}
            {errorProvider && (
              <Typography className='text-error'>Error fetching providers: {errorProvider.message}</Typography>
            )}
            {isSearchingPending && <Typography>Searching providers...</Typography>}
            {searchError && <Typography className='text-error'>Error searching: {searchError.message}</Typography>}

            {isSearching
              ? searchResults?.code == 'SUCCESS' && (
                  <ProviderListTable
                    data={searchResults.data}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                  />
                )
              : providersData?.code == 'SUCCESS' && (
                  <ProviderListTable
                    data={providersData.data}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                  />
                )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProviderListComponent

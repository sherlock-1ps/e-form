// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import { useEffect, useState } from 'react'
import { useDictionary } from '@/contexts/DictionaryContext'

import { toast } from 'react-toastify'
import { ProviderCredentialType } from '@/types/credential/credentialTypes'
import SelectNewProviderTable from './SelectNewProviderTable'
import {
  useAddProviderCredentialListQueryOption,
  useFetchGameCredentialListQueryOption
} from '@/queryOptions/credential/credentialQueryOptions'
import { useQueryClient } from '@tanstack/react-query'

interface AddNewProviderType {
  id: string
  onClick: () => void
  credential: string
}

type ProviderMap = Record<string, ProviderCredentialType[]>

interface DataModifyState {
  provider: ProviderMap
}

const AddNewProviderDialog = ({ id, onClick, credential }: AddNewProviderType) => {
  const { dictionary } = useDictionary()
  const queryClient = useQueryClient()
  const { closeDialog } = useDialog()
  const [data, setData] = useState({})
  const [dataModify, setDataModify] = useState<DataModifyState>({ provider: {} })

  const { mutateAsync, isPending: pendingProviderList, error } = useFetchGameCredentialListQueryOption()

  const { mutateAsync: callAddProvider, isPending: pendingCallAdd } = useAddProviderCredentialListQueryOption()

  const handleConfirm = (dataModify: DataModifyState) => {
    const resultProvider = Object.values(dataModify?.provider || {})
      .flat()
      .filter((p): p is ProviderCredentialType => {
        return (p as ProviderCredentialType).is_select === true && Number((p as ProviderCredentialType).selectShare) > 0
      })
      .map(p => ({
        provider_code: p.provider_code,
        credential_percent: Number(p.selectShare) || 0
      }))

    handleAddProviderApi(resultProvider)
  }

  const handleAddProviderApi = async (list: any) => {
    if (list.length == 0) {
      toast.error('please fill Credential at least 1 provider!', { autoClose: 3000 })

      return
    }

    try {
      const result = await callAddProvider({
        credential_id: credential,
        credential_provider: list
      })
      if (result?.code == 'SUCCESS') {
        toast.success('add provider success!', { autoClose: 3000 })
        closeDialog(id)

        queryClient.invalidateQueries({
          queryKey: ['providersExist']
        })
      } else {
        toast.error('cannot add provider!', { autoClose: 3000 })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (credential) {
      handleFetchProviderList(credential)
    }
  }, [])

  const handleFetchProviderList = async (credential: string) => {
    try {
      const response = await mutateAsync({ credential_id: credential })

      if (response?.code == 'SUCCESS') {
        const updatedProvider = Object.fromEntries(
          Object.entries(response.data as Record<string, ProviderCredentialType[]>)
            .filter(([_, providers]) => Array.isArray(providers) && providers.length > 0)
            .map(([category, providers]) => {
              const updatedProviders = providers.map(provider => ({
                ...provider,
                selectShare: '',
                is_select: true
              }))

              return [category, updatedProviders]
            })
        )
        setData(updatedProvider)
      }
    } catch (error) {
      toast.error('something went wrong', { autoClose: 3000 })
    }
  }

  const handleUpdateProvider = (category: string, index?: number, share?: number, list?: ProviderCredentialType[]) => {
    setDataModify(prev => {
      const currentProvider = prev.provider || {}

      let updatedCategory: ProviderCredentialType[]

      if (list) {
        updatedCategory = list
      } else {
        const categoryList = currentProvider[category] || []
        updatedCategory = categoryList.map((item: any, idx: number | undefined) => {
          if (idx === index) {
            return {
              ...item,
              ...(share !== undefined && { selectShare: share })
            }
          }

          return item
        })
      }

      return {
        ...prev,
        provider: {
          ...currentProvider,
          [category]: updatedCategory
        }
      }
    })
  }

  return (
    <Grid container className='flex flex-col gap-2' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>{'Add new provider'}</Typography>
      </Grid>
      <Divider />
      {pendingProviderList ? (
        <p>Loading....</p>
      ) : (
        data &&
        Object.entries(data).map(([categoryKey, providers]) => (
          <Grid item xs={12} sm={12} key={categoryKey}>
            <Typography variant='h6' className='capitalize'>
              {categoryKey} Type
            </Typography>

            <SelectNewProviderTable dataTable={providers} category={categoryKey} updateMain={handleUpdateProvider} />
          </Grid>
        ))
      )}
      {error && (
        <Grid item xs={12}>
          <Typography className=' text-error'>{error?.message}</Typography>
        </Grid>
      )}

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='outlined'
          onClick={() => {
            closeDialog(id)
          }}
        >
          {dictionary?.cancel ?? 'Cancel'}
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            handleConfirm(dataModify)
          }}
          disabled={pendingCallAdd}
        >
          {dictionary?.confirm ?? 'Confirm'}
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddNewProviderDialog

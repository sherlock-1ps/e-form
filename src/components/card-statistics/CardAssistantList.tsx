/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useState } from 'react'

import classNames from 'classnames'
import { CardContent, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomAvatar from '@/@core/components/mui/Avatar'

type ModeType = 'add' | 'del'

type DataType = {
  id: string
  username: string
  phone_number: string
  avatar?: string
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  isIcon,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  isIcon?: boolean
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      InputProps={{
        endAdornment: isIcon ? (
          <InputAdornment position='end'>
            <IconButton onClick={() => {}}>
              <i className='tabler-search' />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  )
}

const CardAssistantList = ({
  mode,
  title,
  data,
  handleSelected,
  selectedData
}: {
  mode: ModeType
  title: string
  data: DataType[]
  handleSelected: any
  selectedData: DataType[]
}) => {
  const [dataList, setDataList] = useState(selectedData)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setDataList(selectedData)
  }, [selectedData])

  useEffect(() => {
    if (searchText) {
      setDataList(dataList.filter(item => item.username.toLowerCase().includes(searchText.toLowerCase())))
    } else {
      setDataList(selectedData)
    }
  }, [searchText])

  const handleSelectedUser = (item: any) => {
    handleSelected(item)
  }

  return (
    <div>
      <Typography variant='h6' className='pb-4'>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DebouncedInput
            value={searchText}
            onChange={value => setSearchText(String(value))}
            placeholder='Search assistants'
            className='w-full'
            isIcon={true}
          />
        </Grid>
        <Grid item xs={12}>
          <CardContent className='flex flex-col gap-2 overflow-y-auto max-h-[300px]'>
            {dataList.length > 0 ? (
              dataList.map(item => (
                <div
                  key={item.id}
                  className={classNames('flex items-center gap-4 p-1 rounded-sm', {
                    'bg-primaryLight': data.every((assistant: any) => assistant.id !== item.id) && mode === 'add',
                    'bg-errorLight': data.every((assistant: any) => assistant.id !== item.id) && mode === 'del'
                  })}
                >
                  <CustomAvatar size={34} src={'/images/avatars/1.png'} />
                  <div className='flex justify-between items-center w-full gap-4'>
                    <div>
                      <Typography className='font-medium' color='text.primary'>
                        {item?.username}
                      </Typography>
                      <Typography variant='body2'>{item.phone_number}</Typography>
                    </div>
                    <div className='flex flex-1 items-center justify-end gap-2'>
                      <div className='min-w-[30px]'>
                        {data.every((assistant: any) => assistant.id !== item.id) && (
                          <Typography variant='body2' color={mode === 'add' ? 'primary' : 'error'}>
                            {mode === 'add' ? 'New Add' : 'Removing'}
                          </Typography>
                        )}
                      </div>

                      <IconButton
                        onClick={() => handleSelectedUser(item)}
                        className={
                          data.every((assistant: any) => assistant.id !== item.id)
                            ? ''
                            : mode === 'add'
                              ? 'text-error'
                              : 'text-primary'
                        }
                      >
                        <i
                          className={
                            data.every((assistant: any) => assistant.id !== item.id)
                              ? 'tabler-xbox-x-filled'
                              : mode === 'add'
                                ? 'tabler-trash'
                                : 'tabler-circle-plus-filled'
                          }
                        />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={classNames('flex items-center gap-4 p-1 rounded-sm')}>
                <Typography>not found</Typography>
              </div>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </div>
  )
}

export default CardAssistantList

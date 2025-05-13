'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { Controller } from 'react-hook-form'

// Component Imports
import { Avatar, Grid } from '@mui/material'

import classNames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(3)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

interface AssistantImageProps {
  control: any
  name: string
  errors: any
}

const AssistantImage = ({ control, name, errors }: AssistantImageProps) => {
  const [preview, setPreview] = useState<string | null>(null)

  const dropzoneConfig = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (file) {
        setPreview(URL.createObjectURL(file))
      }
    },
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    }
  })

  return (
    <Grid container className='flex items-center gap-2'>
      <Grid
        item
        xs={12}
        className={classNames('flex max-sm:flex-col gap-6 max-sm:items-center items-end', {
          'items-center': preview
        })}
      >
        <div className='flex flex-col items-center'>
          <Typography variant='h5'>Profile</Typography>
          <Avatar src={preview || ''} className='!mbs-1 bs-[110px] is-[110px]' />
        </div>

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange } }) => {
            return (
              <>
                <Dropzone className='w-full'>
                  <div {...dropzoneConfig.getRootProps({ className: 'dropzone' })}>
                    <input {...dropzoneConfig.getInputProps()} />
                    {preview ? (
                      <>
                        <List>
                          <ListItem>
                            <div className='file-details'>
                              <div className='flex items-center gap-2'>
                                <div className='file-preview'>
                                  <img width={70} height={70} alt='File Preview' src={preview} />
                                </div>
                                <div>
                                  <Typography variant='h4' color='text.disabled'>
                                    Click to Change
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </ListItem>
                        </List>
                      </>
                    ) : (
                      <div className='flex items-center flex-col gap-1 text-center'>
                        <div className='flex items-center gap-2'>
                          <CustomAvatar variant='rounded' skin='light' color='secondary'>
                            <i className='tabler-upload' />
                          </CustomAvatar>
                          <Typography variant='h4' color='text.disabled'>
                            Click to Upload
                          </Typography>
                        </div>
                        <Typography variant='h6' color='text.disabled'>
                          Accepted file types: JPEG, PNG
                        </Typography>
                      </div>
                    )}
                  </div>
                </Dropzone>
                {errors.profile_image && <Typography color='error'>{errors.profile_image.message}</Typography>}
              </>
            )
          }}
        />
      </Grid>
    </Grid>
  )
}
export default AssistantImage

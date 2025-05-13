'use client'

// MUI Imports
import type { SyntheticEvent } from 'react'
import { useState } from 'react'

import dynamic from 'next/dynamic'

import Button from '@mui/material/Button'
import type { BoxProps } from '@mui/material'
import { Box, Card, Grid, List, ListItem, styled, Tab, Typography } from '@mui/material'

import { alpha, useTheme } from '@mui/material/styles'

import TabContext from '@mui/lab/TabContext'

import { useDropzone } from 'react-dropzone'

import { useDialog } from '@/hooks/useDialog'

import CustomTabList from '@/@core/components/mui/TabList'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Component Imports

import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

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

interface confirmProps {
  title: string
  id: string
  onClick: () => void
}

const ManageAdvertiseDialog = ({ id, title, onClick }: confirmProps) => {
  const theme = useTheme()
  const { closeDialog } = useDialog()
  const [value, setValue] = useState<string>('1')
  const [dateTimeStart, setDateTimeStart] = useState<Date | null | undefined>(new Date())
  const [dateTimeEnd, setDateTimeEnd] = useState<Date | null | undefined>(new Date())
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (file) {
        setPreview(URL.createObjectURL(file))
      }
    },
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    } // Accept JPEG and PNG files
  })

  return (
    <TabContext value={value}>
      <Grid container className='flex flex-col gap-4' spacing={2}>
        <Grid item xs={12}>
          <Box>
            <Typography variant='h5'>{title}</Typography>
            <Typography variant='h6' className='text-center'>
              ภาพตัวอย่างโฆษณา
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} className='w-full flex items-center justify-center'>
          <img
            src={`/images/advertisement/newsImage.png`}
            width={'400px'}
            alt='image-advertisement'
            className=' rounded'
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Typography>เลือกรูปแบบโฆษณา</Typography>
          <Card sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.2) }}>
            <CustomTabList pill='true' onChange={handleChange}>
              <Tab value='1' label='ข่าวสาร' />
              <Tab value='2' label='แบนเนอร์' />
              <Tab value='3' label='แนะนำเพื่อน' />
              <Tab value='4' label='แคชแบ็ค' />
            </CustomTabList>
          </Card>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} className='w-full flex items-center '>
            <CustomTextField fullWidth label='ชื่อหัวข้อ' placeholder='ชื่อหัวข้อ' />
          </Grid>
          <Grid item xs={12} sm={3.5} className='w-full flex items-center '>
            <AppReactDatepicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={dateTimeStart}
              dateFormat='dd/MM/yyyy h:mm aa'
              onChange={(date: Date | null) => setDateTimeStart(date)}
              customInput={<CustomTextField label='จากถึงวันที่' fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3.5} className='w-full flex items-center '>
            <AppReactDatepicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={dateTimeEnd}
              dateFormat='dd/MM/yyyy h:mm aa'
              onChange={(date: Date | null) => setDateTimeEnd(date)}
              customInput={<CustomTextField label='ถึงวันที่' fullWidth />}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} className='w-full flex items-center justify-center'>
          <RichTextEditor />
        </Grid>

        <Grid item xs={12} className='w-full flex items-center justify-center'>
          <>
            <Dropzone className='w-full'>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
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
          </>
        </Grid>

        <Grid item xs={12} className='flex items-center  justify-end gap-2'>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              closeDialog(id)
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              closeDialog(id), onClick()
            }}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default ManageAdvertiseDialog

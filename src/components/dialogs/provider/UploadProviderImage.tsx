'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const UploadProviderImage = ({ setFileImg }: any) => {
  // States
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 1 * 1024 * 1024, // 1MB limit
    accept: {
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError('File must be a PNG or WEBP and not exceed 1MB.')

        return
      }
      setError(null)
      setFiles(acceptedFiles)
      const file = acceptedFiles[0]

      const reader = new FileReader()
      reader.readAsDataURL(file) // Convert to Base64

      reader.onload = () => {
        setFileImg(reader.result) // ✅ Store Base64 string
      }
      reader.onerror = error => {
        console.error('Error converting file to Base64:', error)
      }

      setFileImg(acceptedFiles[0])
    }
  })

  const renderFilePreview = (file: File) => {
    return <img width={100} height={100} alt={file.name} src={URL.createObjectURL(file)} />
  }

  const handleRemoveFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(i => i.name !== file.name))
    setFileImg(null)
  }

  const fileList = files.map(file => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='flex items-center justify-center'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' variant='body2' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 1024)} KB
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <Dropzone>
      <>
        {error && <Typography color='error'>{error}</Typography>} {/* Show error if exists */}
        {files.length ? (
          <List>{fileList}</List>
        ) : (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-photo' />
              </CustomAvatar>
              <Typography className='font-bold'>Upload Provider Logo</Typography>
              <Typography color='text.disabled'>PNG, WEBP format, Up to 1MB, 200x200px</Typography>
            </div>
          </div>
        )}
      </>
    </Dropzone>
  )
}

export default UploadProviderImage

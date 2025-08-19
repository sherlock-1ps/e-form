'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Breadcrumbs, Typography, Button, Grid, Card, CardMedia, CardContent, IconButton,Box } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { PermMediaOutlined, PlayCircleOutline, Upload, Delete, Edit, DownloadOutlined } from '@mui/icons-material'
import OptionMenu from '@/@core/components/option-menu'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import ChangeNameFormMedia from '@/components/dialogs/form/ChangeNameFormMedia'
import {
  useDeleteFolderMediaQueryOption,
  useDeleteImageMediaQueryOption,
  useFetchMediaQueryOption,
  useUploadImageMediaQueryOption
} from '@/queryOptions/form/formQueryOptions'
import CreateFolderMedia from '@/components/dialogs/form/CreateFolderMedia'
import { toast } from 'react-toastify'
import ShowImageDialog from '@/components/dialogs/form/ShowImageDialog'
import ChangeNameImageMedia from '@/components/dialogs/form/ChangeNameImageMedia'
import { useDictionary } from '@/contexts/DictionaryContext'

const acceptedFileTypes = ['.JPG', '.PNG', '.GIF', '.WEBP', '.BMP', '.AVI', '.MP4', '.MOV']

const MediaFormComponent = () => {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const inputRef = useRef<HTMLInputElement>(null)
  const [folderStack, setFolderStack] = useState<any>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [id, setId] = useState<number | null>(null)
  const { data: mediaData, isPending: pendingMedia } = useFetchMediaQueryOption(id)
  const { mutateAsync: callDeleteFolder } = useDeleteFolderMediaQueryOption()
  const { mutateAsync: uploadImage, isPending: pendingUpload } = useUploadImageMediaQueryOption()
  const { mutateAsync: deleteImage } = useDeleteImageMediaQueryOption()

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = Number(process.env.NEXT_PUBLIC_MAX_FILE_IMAGE_SIZE_MB) * 1024 * 1024
      if (file.size > maxSize) {
        alert('ขนาดไฟล์ต้องไม่เกิน 20 MB')

        return
      }

      setSelectedFile(file)

      if (file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file))
      } else {
        setImagePreview(null)
      }
    }
  }

  const handleFolderDoubleClick = (folder: any) => {
    setId(folder?.id)
    setFolderStack((prev: any[]) => [...prev, { id: folder.id, name: folder.name }])
  }

  const handleShowImage = (media: any) => {
    showDialog({
      id: 'alertShowImageDialog',
      component: <ShowImageDialog data={media} />,
      size: 'lg'
    })
  }

  const handleCreateFolder = async (id: any) => {
    showDialog({
      id: 'alertCreateFolderMedia',
      component: <CreateFolderMedia id='alertCreateFolderMedia' data={id} onClick={() => {}} />,
      size: 'sm'
    })
  }

  const handleDeleteFolder = async (folderId: any) => {
    try {
      const response = await callDeleteFolder({ id: folderId })
      if (response?.code == 'SUCCESS') {
        toast.success('ลบโฟลเดอร์สำเร็จ', { autoClose: 3000 })
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error('ลบโฟลเดอร์ล้มเหลว', { autoClose: 3000 })
    }
  }

  const handleUploadImage = async (id: number | null) => {
    if (!selectedFile) {
      toast.error('กรุณาเลือกไฟล์ก่อนอัปโหลด', { autoClose: 3000 })

      return
    }

    if (!id) {
      toast.error('ต้องเข้าถึงโฟล์เดอร์ที่ต้องการก่อนหรือสร้างโฟลเดอร์ก่อน', { autoClose: 3000 })

      return
    }

    try {
      const response = await uploadImage({ file: selectedFile, folderId: id })
      if (response?.code === 'SUCCESS') {
        toast.success('อัปโหลดรูปสำเร็จ', { autoClose: 3000 })
        setSelectedFile(null)
        setImagePreview(null)
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error('อัปโหลดรูปล้มเหลว', { autoClose: 3000 })
    }
  }

  const handleDeleteImage = async (imageId: any) => {
    try {
      const response = await deleteImage({ id: imageId })
      if (response?.code == 'SUCCESS') {
        toast.success('ลบสำเร็จ', { autoClose: 3000 })
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error('ลบล้มเหลว', { autoClose: 3000 })
    }
  }

  function CardMediaOrExt({ media }: { media: any }) {
    // หานามสกุลไฟล์จาก media.name
    const extension = media?.url_file_download?.split('.').pop()?.toUpperCase()

    if (media?.url_thumbnail_download) {
      return (
        <CardMedia
          component='img'
          height='208'
          image={media.url_thumbnail_download}
          title={media.name}
          alt={media.name}
          className='object-fit p-2'
        />
      )
    }

    return (
      <Box
        height={208}
        display='flex'
        alignItems='center'
        justifyContent='center'
        className='p-2'
        sx={{
          bgcolor: '#f5f5f5',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: '#555'
        }}
      >
        {extension ? `${extension}` : 'NO FILE'}
      </Box>
    )
  }

  return (
    <Grid container spacing={6} className='pb-[240px]'>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex gap-2 items-center flex-wrap'>
            <div
              className='flex gap-1 items-center cursor-pointer text-primary'
              onClick={() => {
                setId(null), setFolderStack([])
              }}
            >
              <PermMediaOutlined />
              <Typography className='text-primary'>Media Library</Typography>
            </div>

            {folderStack.map((stack: any, index: number) => (
              <div key={index} className='flex gap-1 items-center'>
                <span>/</span>
                <Typography
                  className={`cursor-pointer ${index < folderStack.length - 1 ? 'text-primary' : ''}`}
                  onClick={() => {
                    setId(stack.id)
                    setFolderStack(folderStack.slice(0, index + 1))
                  }}
                >
                  {stack.name}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {pendingMedia && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography>{dictionary?.loading}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
      {mediaData?.code == 'SUCCESS' &&
        !pendingMedia &&
        mediaData?.result?.data?.folders.length == 0 &&
        mediaData?.result?.data?.medias.length == 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>ไม่พบข้อมูล ลองสร้างโฟลเดอร์หรืออัพโหลดไฟล์</CardContent>
            </Card>
          </Grid>
        )}

      {mediaData?.code == 'SUCCESS' &&
        !pendingMedia &&
        mediaData?.result?.data?.folders.length > 0 &&
        mediaData?.result?.data?.folders.map((folder: any, index: number) => {
          return (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Card onDoubleClick={() => handleFolderDoubleClick(folder)}>
                <CardContent>
                  <div className='flex flex-col justify-between h-[208px] text-gray-500 p-2'>
                    <div
                      className='flex justify-end'
                      onClick={e => e.stopPropagation()}
                      onDoubleClick={e => e.stopPropagation()}
                    >
                      <OptionMenu
                        iconButtonProps={{ size: 'medium' }}
                        iconClassName='text-textSecondary'
                        options={[
                          {
                            text: 'แก้ไขชื่อ',
                            icon: <Edit />,
                            menuItemProps: {
                              className: ' text-secondary',
                              onClick: () => {
                                showDialog({
                                  id: 'alertChangeNameFormMedia',
                                  component: (
                                    <ChangeNameFormMedia
                                      data={folder}
                                      id='alertChangeNameFormMedia'
                                      onClick={() => {}}
                                    />
                                  ),
                                  size: 'sm'
                                })
                              }
                            }
                          },
                          {
                            text: 'ลบ',
                            icon: <Delete />,
                            menuItemProps: {
                              className: 'text-error',
                              onClick: () => {
                                showDialog({
                                  id: 'alertDeleteMedia',
                                  component: (
                                    <ConfirmAlert
                                      id='alertDeleteMedia'
                                      title={'ลบโฟลเดอร์'}
                                      content1={`คุณต้องการลบโฟลเดอร์นี้ใช่หรือไม่`}
                                      content2={`*ไฟล์ทั้งหมดในโฟลเดอร์นี้จะถูกลบไปด้วย`}
                                      onClick={() => {
                                        handleDeleteFolder(folder?.id)
                                      }}
                                    />
                                  ),
                                  size: 'sm'
                                })
                              }
                            }
                          }
                        ]}
                      />
                    </div>

                    <div className='flex flex-1 items-center justify-center'>
                      <div className='flex flex-col items-center'>
                        <FolderIcon fontSize='large' />
                        <Typography variant='body1' className='mt-2'>
                          {folder.name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )
        })}

      {mediaData?.code == 'SUCCESS' &&
        !pendingMedia &&
        mediaData?.result?.data?.medias.length > 0 &&
        mediaData?.result?.data?.medias.map((media: any, index: number) => {
          return (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Card>
                <CardContent onDoubleClick={() => handleShowImage(media)}>
                  <>
                    <CardContent className='flex justify-between items-center py-2 px-3'>
                      <Typography variant='body2' noWrap className='w-full'>
                        {media.name}
                      </Typography>
                      <div
                        className='flex justify-end'
                        onClick={e => e.stopPropagation()}
                        onDoubleClick={e => e.stopPropagation()}
                      >
                        <OptionMenu
                          iconButtonProps={{ size: 'medium' }}
                          iconClassName='text-textSecondary'
                          options={[
                            {
                              text: 'ดาวน์โหลด',
                              icon: <DownloadOutlined />,
                              menuItemProps: {
                                className: ' text-primary',
                                onClick: () => {
                                  const imageUrl = media?.url_file_download
                                  if (!imageUrl) return

                                  fetch(imageUrl)
                                    .then(response => response.blob())
                                    .then(blob => {
                                      const url = URL.createObjectURL(blob)
                                      const link = document.createElement('a')
                                      link.href = url
                                      link.download = imageUrl.split('/').pop() || 'download.jpg'
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                      URL.revokeObjectURL(url)
                                    })
                                    .catch(() => {
                                      toast.error('ไม่สามารถดาวน์โหลดไฟล์ได้', { autoClose: 3000 })
                                    })
                                }
                              }
                            },
                            {
                              text: 'แก้ไขชื่อ',
                              icon: <Edit />,
                              menuItemProps: {
                                className: ' text-secondary',
                                onClick: () => {
                                  showDialog({
                                    id: 'alertChangeNameImageMedia',
                                    component: (
                                      <ChangeNameImageMedia
                                        data={media}
                                        id='alertChangeNameImageMedia'
                                        onClick={() => {}}
                                      />
                                    ),
                                    size: 'sm'
                                  })
                                }
                              }
                            },
                            {
                              text: 'ลบ',
                              icon: <Delete />,
                              menuItemProps: {
                                className: 'text-error',
                                onClick: () => {
                                  showDialog({
                                    id: 'alertDeleteMedia',
                                    component: (
                                      <ConfirmAlert
                                        id='alertDeleteMedia'
                                        title={'ลบรูปภาพหรือวีดีโอ'}
                                        content1={`คุณต้องการลบใช่หรือไม่`}
                                        onClick={() => {
                                          handleDeleteImage(media?.id)
                                        }}
                                      />
                                    ),
                                    size: 'sm'
                                  })
                                }
                              }
                            }
                          ]}
                        />
                      </div>
                    </CardContent>

                    <CardMediaOrExt media={media} />
                    {/* <CardMedia
                      component='img'
                      height='208'
                      image={media?.url_thumbnail_download || '/images/pages/auth-reg-multi-mask-light.png'}
                      title=''
                      alt={media.name}
                      className='object-fit p-2'
                    /> */}
                    {/* <CardContent className='flex justify-end items-center p-3 '>
                  <Typography variant='body2' noWrap>
                    ใช้งานอยู่
                  </Typography>
                </CardContent> */}
                  </>
                </CardContent>
              </Card>
            </Grid>
          )
        })}

      <div className='fixed bottom-0 right-0 p-4 w-full max-w-[600px]'>
        <Card>
          <CardContent className=''>
            <div className='flex justify-between mb-2'>
              <Typography variant='h6'>อัปโหลดไฟล์มีเดีย</Typography>
              <Typography variant='body2' className='text-gray-600'>
                {acceptedFileTypes.join(', ')}
              </Typography>
            </div>

            {selectedFile ? (
              <div className='border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center border-gray-300'>
                {imagePreview && (
                  <img src={imagePreview} alt='preview' className='w-[200px] h-auto rounded mb-4 object-contain' />
                )}
                <Typography variant='body2' className='text-green-600'>
                  ✅ เลือกแล้ว: {selectedFile.name}
                </Typography>
                <div className='flex gap-2'>
                  <Button
                    variant='contained'
                    color='error'
                    className='mt-2'
                    onClick={() => {
                      setSelectedFile(null)
                      setImagePreview(null)
                      if (inputRef.current) inputRef.current.value = ''
                    }}
                  >
                    ลบ
                  </Button>
                  <Button
                    variant='contained'
                    className='mt-2 '
                    color='primary'
                    disabled={pendingUpload}
                    onClick={() => {
                      handleUploadImage(id)
                    }}
                  >
                    UPLOAD
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className='border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center border-gray-300'>
                  <Upload fontSize='large' color='primary' />

                  <Button
                    variant='contained'
                    className='mt-2 bg-blue-100 text-blue-600'
                    onClick={() => inputRef.current?.click()}
                  >
                    เลือกจากเครื่อง
                  </Button>

                  <input
                    ref={inputRef}
                    type='file'
                    hidden
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleBrowse}
                  />
                </div>
                <div className='flex items-center justify-between mt-4'>
                  <Typography variant='h6'>สร้างโฟลเดอร์</Typography>
                  <Button
                    variant='contained'
                    className='mt-2 bg-blue-100 text-blue-600'
                    onClick={() => {
                      handleCreateFolder(id)
                    }}
                  >
                    สร้างโฟลเดอร์
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Grid>
  )
}

export default MediaFormComponent

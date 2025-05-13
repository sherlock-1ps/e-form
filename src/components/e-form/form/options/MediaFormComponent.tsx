'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Breadcrumbs, Typography, Button, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { PermMediaOutlined, PlayCircleOutline, Upload, Delete, Edit, DownloadOutlined } from '@mui/icons-material'
import OptionMenu from '@/@core/components/option-menu'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import ChangeNameFormMedia from '@/components/dialogs/form/ChangeNameFormMedia'
import ChangeNameImgFormMedia from '@/components/dialogs/form/ChangeNameImgFormMedia'

type MediaItem = {
  name: string
  type: 'folder' | 'image' | 'video'
  thumbnail: string
  children?: MediaItem[]
}

const mockMediaItems: MediaItem[] = [
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  },
  {
    name: 'โฟลเดอร์ A',
    type: 'folder',
    thumbnail: '',
    children: [
      {
        name: 'โฟลเดอร์ B',
        type: 'folder',
        thumbnail: '',
        children: [
          {
            name: 'deep.png',
            type: 'image',
            thumbnail: '/images/dtn-logo-lg.png'
          }
        ]
      },
      {
        name: 'logo.png',
        type: 'image',
        thumbnail: '/images/dtn-logo-lg.png'
      }
    ]
  }
]

const acceptedFileTypes = ['.JPG', '.PNG', '.GIF', '.WEBP', '.BMP', '.AVI', '.MP4', '.MOV']

const MediaFormComponent = () => {
  const { showDialog } = useDialog()
  const [folderStack, setFolderStack] = useState<MediaItem[][]>([mockMediaItems])
  const currentItems = folderStack[folderStack.length - 1]
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 20 * 1024 * 1024 // 20MB
      if (file.size > maxSize) {
        alert('ขนาดไฟล์ต้องไม่เกิน 20 MB')

        return
      }

      setSelectedFile(file)

      // Generate image preview only for images
      if (file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file))
      } else {
        setImagePreview(null)
      }
    }
  }

  const handleFolderDoubleClick = (folder: MediaItem) => {
    if (Array.isArray(folder.children)) {
      setFolderStack(prev => [...prev, folder.children!])
    }
  }

  return (
    <Grid container spacing={6} className='pb-[240px]'>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex gap-2 items-center flex-wrap'>
            <div
              className='flex gap-1 items-center cursor-pointer text-primary'
              onClick={() => setFolderStack([folderStack[0]])}
            >
              <PermMediaOutlined />
              <Typography className='text-primary'>Media Library</Typography>
            </div>

            {folderStack.slice(1).map((stack, index) => {
              const parentFolder = folderStack[index].find(folder => folder.children === stack)

              return (
                <div key={index} className='flex gap-1 items-center'>
                  <span>/</span>
                  <Typography
                    className={`cursor-pointer ${index < folderStack.length - 2 ? 'text-primary' : ''}`}
                    onClick={() => {
                      const newStack = folderStack.slice(0, index + 2)
                      setFolderStack(newStack)
                    }}
                  >
                    {parentFolder?.name ?? `โฟลเดอร์ ${index + 1}`}
                  </Typography>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </Grid>
      {currentItems.map((item, index) => (
        <Grid item xs={12} sm={4} md={3} key={index}>
          <Card
            className='relative cursor-pointer'
            onDoubleClick={() => item.type === 'folder' && handleFolderDoubleClick(item)}
          >
            {item.type === 'folder' ? (
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
                                  data={item?.name ?? ''}
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
                                  onClick={() => {}}
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
                      {item.name}
                    </Typography>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <CardContent className='flex justify-between items-center py-2 px-3'>
                  <Typography variant='body2' noWrap className='w-full'>
                    {item.name}
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
                            onClick: () => {}
                          }
                        },
                        {
                          text: 'แก้ไขชื่อ',
                          icon: <Edit />,
                          menuItemProps: {
                            className: ' text-secondary',
                            onClick: () => {
                              showDialog({
                                id: 'alertChangeNameImgFormMedia',
                                component: (
                                  <ChangeNameImgFormMedia
                                    data={item?.name ?? ''}
                                    id='alertChangeNameImgFormMedia'
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
                                    onClick={() => {}}
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
                <CardMedia
                  component='img'
                  height='208'
                  image={item.thumbnail}
                  alt={item.name}
                  className='object-fit p-2'
                />
                {/* <CardContent className='flex justify-end items-center p-3 '>
                  <Typography variant='body2' noWrap>
                    ใช้งานอยู่
                  </Typography>
                </CardContent> */}
              </>
            )}
          </Card>
        </Grid>
      ))}

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
                  <Button variant='contained' className='mt-2 ' color='primary' onClick={() => {}}>
                    UPLOAD
                  </Button>
                </div>
              </div>
            ) : (
              <div className='border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center border-gray-300'>
                <Upload fontSize='large' color='primary' />

                <Button
                  variant='contained'
                  className='mt-2 bg-blue-100 text-blue-600'
                  onClick={() => inputRef.current?.click()}
                >
                  เลือกจากเครื่อง
                </Button>

                <input ref={inputRef} type='file' hidden accept={acceptedFileTypes.join(',')} onChange={handleBrowse} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Grid>
  )
}

export default MediaFormComponent

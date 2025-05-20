// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import { useFetchMediaQueryOption } from '@/queryOptions/form/formQueryOptions'
import { useState } from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import OptionMenu from '@/@core/components/option-menu'
import { PermMediaOutlined, PlayCircleOutline, Upload, Delete, Edit, DownloadOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useFormStore } from '@/store/useFormStore'

interface selectMediaProps {
  id: string
}

const SelectMediaImgDialog = ({ id }: selectMediaProps) => {
  const { closeDialog } = useDialog()
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)
  const [idMedia, setIdMedia] = useState<number | null>(null)
  const [folderStack, setFolderStack] = useState<any>([])
  const { data: mediaData, isPending: pendingMedia } = useFetchMediaQueryOption(idMedia)

  const handleFolderDoubleClick = (folder: any) => {
    setIdMedia(folder?.id)
    setFolderStack((prev: any[]) => [...prev, { id: folder.id, name: folder.name }])
  }

  const handleSelectFile = (media: any) => {
    updateDetails(
      String(selectedField?.parentKey ?? ''),
      selectedField?.boxId ?? '',
      selectedField?.fieldId?.id ?? '',
      {
        value: {
          value: media?.url_file_download,
          ...media
        }
      }
    )
    closeDialog(id)
  }

  return (
    <Grid container className='' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>เลือกรูปภาพ</Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent className='flex gap-2 items-center flex-wrap'>
            <div
              className='flex gap-1 items-center cursor-pointer text-primary'
              onClick={() => {
                setIdMedia(null), setFolderStack([])
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
                    setIdMedia(stack.id)
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

      {mediaData?.code == 'SUCCESS' &&
        !pendingMedia &&
        mediaData?.result?.data?.folders.length == 0 &&
        mediaData?.result?.data?.medias.length == 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>ไม่พบข้อมูล ลองสร้างโฟลเดอร์หรืออัพโหลดไฟล์ในคลังมีเดีย</CardContent>
            </Card>
          </Grid>
        )}

      {mediaData?.code == 'SUCCESS' &&
        !pendingMedia &&
        mediaData?.result?.data?.folders.length > 0 &&
        mediaData?.result?.data?.folders.map((folder: any, index: number) => {
          return (
            <Grid item xs={4} sm={4} md={3} key={index}>
              <Card onDoubleClick={() => handleFolderDoubleClick(folder)}>
                <CardContent>
                  <div className='flex flex-col justify-between h-[208px] text-gray-500 p-2'>
                    <div
                      className='flex justify-end'
                      onClick={e => e.stopPropagation()}
                      onDoubleClick={e => e.stopPropagation()}
                    ></div>

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

      {mediaData?.code === 'SUCCESS' &&
        !pendingMedia &&
        mediaData?.result?.data?.medias?.length > 0 &&
        mediaData.result.data.medias
          .filter((media: any) => media.media_type.startsWith('image/'))
          .map((media: any) => (
            <Grid item xs={12} sm={4} md={3} key={media.id}>
              <Card onDoubleClick={() => handleSelectFile(media)}>
                <CardContent>
                  <CardContent className='flex justify-between items-center py-2 px-3'>
                    <Typography variant='body2' noWrap className='w-full'>
                      {media.name}
                    </Typography>
                    <div
                      className='flex justify-end'
                      onClick={e => e.stopPropagation()}
                      onDoubleClick={e => e.stopPropagation()}
                    />
                  </CardContent>

                  <CardMedia
                    component='img'
                    height='208'
                    image={media.url_thumbnail_download || media.url_file_download}
                    alt={media.name}
                    className='object-fit p-2'
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default SelectMediaImgDialog

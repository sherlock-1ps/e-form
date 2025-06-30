'use client'
import { useRef } from 'react'
import { DeleteOutline } from '@mui/icons-material'
import { MAX_FILE_IMAGE_SIZE_MB } from '@/data/toolbox/toolboxMenu'
import { useFormStore } from '@/store/useFormStore'
import { Button, IconButton, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDictionary } from '@/contexts/DictionaryContext'

const UploadForm = ({ item, parentKey, boxId, draft }: any) => {
  const { dictionary } = useDictionary()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const selectedField = useFormStore(state => state.selectedField)
  const updateDetails = useFormStore(state => state.updateDetails)

  const handleDivClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    if (!file) return

    event.target.value = ''

    const allowedTypes = item?.config?.details?.fileType || []
    const fileExt = '.' + file.name.split('.').pop().toLowerCase()

    if (!allowedTypes.includes(fileExt)) {
      alert('สกุลไฟล์ไม่รองรับ')

      return
    }

    const fileSizeMB = file.size / (1024 * 1024)

    if (fileSizeMB > item?.config?.details?.maxSize) {
      alert(`ไฟล์เกิน ${item?.config?.details?.maxSize} MB.`)

      return
    }
    const currentLengthFile = item?.config?.details?.value.length
    if (currentLengthFile >= item?.config?.details?.maxFileUpload) {
      alert(`รองรับไฟล์จำนวนสูงสุุดไม่เกิน ${item?.config?.details?.maxFileUpload} ไฟล์`)

      return
    }

    const fileName = file.name
    const resultFileSize = fileSizeMB.toFixed(2)
    const objectUrl = URL.createObjectURL(file)
    const existing = item?.config?.details?.value || []
    const result = { value: objectUrl, comment: '', size: resultFileSize, name: fileName, type: fileExt }

    updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
      value: [...existing, result]
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: item?.config?.style?.width ?? item?.config?.style?.defaultWidth,
        height: item?.config?.style?.height ?? item?.config?.style?.defaultHeight,
        opacity: item?.config?.details?.isShow ? 1 : 0,
        padding: '8px',
        backgroundColor: '#F3F2F5'
      }}
    >
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept='.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv'
        onChange={item?.config?.details?.isUse ? handleFileChange : undefined}
      />

      {item?.config?.details?.value.length > 0 ? (
        <div className='flex gap-4 flex-col'>
          <div className={`grid gap-4 ${item?.config?.details?.value.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {item?.config?.details?.value.map((data: any, index: number) => {
              return (
                <div key={index} className='flex flex-1 flex-col gap-4  relative'>
                  <IconButton
                    onMouseDown={e => e.preventDefault()}
                    className=' absolute top-[5px] right-[5px] z-20 bg-errorLight p-1 bg-white'
                    onClick={() => {
                      const newValue = item?.config?.details?.value.filter((_: any, i: any) => i !== index)

                      updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
                        value: newValue
                      })
                    }}
                  >
                    <DeleteOutline className=' text-error ' />
                  </IconButton>
                  <div className='flex w-full flex-col gap-0 bg-white rounded-sm overflow-hidden text-wrap flex-1'>
                    <div className='flex flex-1'>
                      {['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv'].some(ext =>
                        data?.name?.toLowerCase().endsWith(ext)
                      ) ? (
                        <div className='min-h-[100px] flex items-center justify-center flex-1 p-2 overflow-hidden'>
                          <a
                            href={data?.value}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 underline text-sm break-words text-wrap text-center w-full'
                          >
                            {data?.name}
                          </a>
                        </div>
                      ) : (
                        <img
                          src={data?.value}
                          alt='Uploaded file'
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          className='flex-1 flex'
                        />
                      )}
                    </div>
                    <div className='flex items-center justify-between px-1 gap-2 '>
                      <Typography variant='body2' className=' truncate block'>
                        {data?.name}
                      </Typography>
                      <Typography variant='body2' className='block text-end'>
                        {data?.size}
                        MB
                      </Typography>
                      <Typography variant='body2' className='block text-end'>
                        {data?.type}
                      </Typography>
                    </div>
                  </div>
                  <div className='flex'>
                    <CustomTextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={data?.comment}
                      label={dictionary?.comment}
                      disabled={!item?.config?.details?.isUse}
                      placeholder={dictionary?.enterComment}
                      onChange={e => {
                        const newValue = [...item?.config?.details?.value]
                        newValue[index] = {
                          ...newValue[index],
                          comment: e.target.value
                        }

                        updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
                          value: newValue
                        })
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            variant='contained'
            color='primary'
            size='small'
            disabled={!item?.config?.details?.isUse}
            onClick={handleDivClick}
          >
            เลือกจากเครื่อง
          </Button>
        </div>
      ) : (
        <div className='flex w-full h-full items-center justify-center flex-col gap-6 py-8 bg-primaryLight'>
          {item?.config?.details?.placeholder?.isShow && (
            <Typography variant='body1'>{item?.config?.details?.placeholder?.value}</Typography>
          )}
          <Button variant='contained' color='primary' disabled={!item?.config?.details?.isUse} onClick={handleDivClick}>
            เลือกจากเครื่อง
          </Button>
        </div>
      )}
    </div>
  )
}

export default UploadForm

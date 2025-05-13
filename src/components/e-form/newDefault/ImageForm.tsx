'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { InsertPhotoOutlined } from '@mui/icons-material'
import { MAX_FILE_IMAGE_SIZE_MB } from '@/data/toolbox/toolboxMenu'
import { useFormStore } from '@/store/useFormStore'

const ImageForm = ({ item, draft }: any) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)

  const handleDivClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    if (!file) return

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > MAX_FILE_IMAGE_SIZE_MB) {
      alert(`File size exceeds ${MAX_FILE_IMAGE_SIZE_MB} MB.`)

      return
    }

    const objectUrl = URL.createObjectURL(file)

    updateValue(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', objectUrl)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: item?.config?.style?.width ? item?.config?.style?.width : item?.config?.style?.defaultWidth,
        height: item?.config?.style?.height ? item?.config?.style?.height : item?.config?.style?.defaultHeight,
        cursor: 'pointer',
        opacity: item?.config?.details?.isShow ? 1 : 0
      }}
      onDoubleClick={item?.config?.details?.isUse ? handleDivClick : undefined}
    >
      {item?.config?.details?.value ? (
        <img
          // src={URL?.createObjectURL(item?.config?.details?.value)}
          src={item.config.details.value}
          alt='Uploaded Preview'
          style={{
            width: '100%',
            height: '100%',
            objectFit: item?.config?.style?.objectFit
          }}
        />
      ) : (
        <div>
          <InsertPhotoOutlined
            style={{ width: '100%', height: '100%', color: '#a0a0a0' }}
            className={`${!draft && 'bg-primaryLighter'}`}
          />
          {!draft && (
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept='image/png, image/jpeg'
              onChange={item?.config?.details?.isUse ? handleFileChange : undefined}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ImageForm

'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { InsertPhotoOutlined } from '@mui/icons-material'
import { MAX_FILE_IMAGE_SIZE_MB } from '@/data/toolbox/toolboxMenu'

const ImageForm = item => {
  const fileInputRef = useRef(null)

  const handleDivClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > MAX_FILE_IMAGE_SIZE_MB) {
        alert(`File size exceeds ${MAX_FILE_IMAGE_SIZE_MB} MB. Please upload a smaller file.`)

        return
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: item?.config?.style?.width,
        height: item?.config?.style?.height,
        cursor: 'pointer'
      }}
      onDoubleClick={handleDivClick}
    >
      {item?.config?.details?.value ? (
        <img
          src={URL.createObjectURL(item?.config.details.value)}
          alt='Uploaded Preview'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <>
          <InsertPhotoOutlined style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept='image/png, image/jpeg'
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  )
}

export default ImageForm

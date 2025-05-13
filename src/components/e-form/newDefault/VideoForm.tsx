'use client'
import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { OndemandVideoOutlined } from '@mui/icons-material'
import { MAX_FILE_VIDEO_SIZE_MB } from '@/data/toolbox/toolboxMenu'
import { useFormStore } from '@/store/useFormStore'

const VideoForm = ({ item, draft }: any) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const updateValue = useFormStore(state => state.updateValue)
  const selectedField = useFormStore(state => state.selectedField)

  const handleDivClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > MAX_FILE_VIDEO_SIZE_MB) {
        alert(`File size exceeds ${MAX_FILE_VIDEO_SIZE_MB} MB. Please upload a smaller video.`)

        return
      }
      const objectUrl = URL.createObjectURL(file)

      updateValue(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', objectUrl)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        width: item?.config?.style?.width ? item?.config?.style?.width : item?.config?.style?.defaultWidth,
        height: item?.config?.style?.height ? item?.config?.style?.height : item?.config?.style?.defaultHeight,
        opacity: item?.config?.details?.isShow ? 1 : 0
      }}
      onDoubleClick={item?.config?.details?.isUse ? handleDivClick : undefined}
    >
      {item?.config.details?.value ? (
        <video
          src={item?.config.details?.value}
          autoPlay={item?.config?.style?.autoPlay}
          loop={item?.config?.style?.loop}
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', color: '#a0a0a0' }} className={`${!draft && 'bg-primaryLighter'}`}>
          <OndemandVideoOutlined style={{ width: '100%', height: '100%' }} />
          {!draft && (
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept='video/mp4, video/webm, video/ogg'
              onChange={item?.config?.details?.isUse ? handleFileChange : undefined}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default VideoForm

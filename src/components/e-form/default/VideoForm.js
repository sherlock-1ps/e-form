'use client'
import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { OndemandVideoOutlined } from '@mui/icons-material'
import { MAX_FILE_VIDEO_SIZE_MB } from '@/data/toolbox/toolboxMenu'

const VideoForm = props => {
  const { config, id } = props
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const handleDivClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > MAX_FILE_VIDEO_SIZE_MB) {
        alert(`File size exceeds ${MAX_FILE_VIDEO_SIZE_MB} MB. Please upload a smaller video.`)

        return
      }

      dispatch()
      // setValueElement({
      //   id: id,
      //   key: 'value',
      //   value: file
      // })
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: config?.style?.width || '300px',
        height: config?.style?.height || '200px',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={handleDivClick}
    >
      {config.details?.value ? (
        <video
          src={URL.createObjectURL(config.details?.value)}
          autoPlay
          loop
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <OndemandVideoOutlined style={{ width: '100%', height: '100%' }} />
      )}
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept='video/mp4, video/webm, video/ogg'
        onChange={handleFileChange}
      />
    </div>
  )
}

export default VideoForm

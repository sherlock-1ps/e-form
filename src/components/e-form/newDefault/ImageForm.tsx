'use client'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { InsertPhotoOutlined, DeleteOutlined } from '@mui/icons-material'
import { MAX_FILE_IMAGE_SIZE_MB, toolboxDocumentBaseMenu } from '@/data/toolbox/toolboxMenu'
import { useFormStore } from '@/store/useFormStore'
import { useDialog } from '@/hooks/useDialog'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'

const ImageForm = ({ item, parentKey, boxId, draft }: any) => {
  const { showDialog } = useDialog()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const updateValue = useFormStore(state => state.updateValue)
  const updateValueOnly = useFormStore(state => state.updateValueOnly)
  const updateDetails = useFormStore(state => state.updateDetails)
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
    // updateValueOnly(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', objectUrl)
  }

  const handleLoad = () => {}

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: item?.config?.style?.width ? item?.config?.style?.width : item?.config?.style?.defaultWidth,
        height: item?.config?.style?.height ? item?.config?.style?.height : item?.config?.style?.defaultHeight,
        opacity: item?.config?.details?.isShow ? 1 : 0
      }}
      onDoubleClick={item?.config?.details?.isUse ? handleDivClick : undefined}
    >
      {item?.config?.details?.value?.value ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={item?.config?.details?.value?.value}
            onLoad={handleLoad}
            alt='Uploaded Preview'
            style={{
              width: '100%',
              height: '100%',
              objectFit: item?.config?.style?.objectFit
            }}
          />
          {!draft && (
            <div
              onClick={
                () =>
                  showDialog({
                    id: 'alertDialogConfirmToggleTrigger',
                    component: (
                      <ConfirmAlert
                        id='alertDialogConfirmToggleTrigger'
                        title='ลบรูปภาพ'
                        content1='คุณต้องการลบรูปภาพนี้ ใช่หรือไม่'
                        onClick={() => {
                          updateDetails(String(parentKey ?? ''), boxId ?? '', item?.id ?? '', {
                            value: toolboxDocumentBaseMenu[2]?.config?.details?.value
                          })
                        }}
                      />
                    ),
                    size: 'sm'
                  })

                // updateValueOnly(String(selectedField?.parentKey ?? ''), selectedField?.boxId ?? '', item?.id ?? '', '')
              }
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DeleteOutlined style={{ color: 'red', fontSize: '20px' }} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <InsertPhotoOutlined
            style={{ width: '100%', height: '100%', color: '#a0a0a0' }}
            className={`${!draft && 'bg-primaryLighter'}`}
          />
          {/* {!draft && (
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept='image/png, image/jpeg'
              onChange={item?.config?.details?.isUse ? handleFileChange : undefined}
            />
          )} */}
        </div>
      )}
    </div>
  )
}

export default ImageForm

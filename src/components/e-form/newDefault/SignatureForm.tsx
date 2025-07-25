'use client'
import { useEffect, useState } from 'react' // Removed unused 'useRef'
import { Button, Typography, TextField } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import SettingSignDialog from '@/components/dialogs/form/SettingSignDialog'
import { DeleteOutlined, Check, CheckCircle } from '@mui/icons-material'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import Alert from '@/components/dialogs/alerts/Alert'
import { useFormStore } from '@/store/useFormStore'
import { useDictionary } from '@/contexts/DictionaryContext'
import {
  useReplaceSignatrueFormQueryOption,
  useSelectSignatrueFormQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { toast } from 'react-toastify'

// import { formatThaiDate } from './formatDateTime'
import { formatThaiDate } from '@/utils/formatDateTime'

const SignatureForm = ({ item, parentKey, boxId, draft }: any) => {
  const { mutateAsync: replaceSignatrueForm } = useReplaceSignatrueFormQueryOption()
  const { mutateAsync: selectSignatrueForm } = useSelectSignatrueFormQueryOption()
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)

  // 1. Use useState for `currentItem`. Initialize with the passed `item`.
  const [currentItem, setCurrentItem] = useState(item)

  // const [isDisplayCurrent, setIsDisplayCurrent] = useState(true)

  // 2. Use useEffect to update `currentItem` based on the cloning logic.
  // This runs when `item` or `form` changes.
  useEffect(() => {
    if (item?.config?.details?.signType?.type === 'clone' && item?.config?.details?.signType?.formId) {
      const cloned = form?.form_details
        ?.flatMap(section => section.fields)
        .flatMap(field => field.data)
        .find(dataItem => dataItem.id === item.config.details.signType.formId)

      if (cloned) {
        setCurrentItem(cloned)
      } else {
        setCurrentItem(item) // Fallback to original item if clone not found
      }
    } else {
      if (item?.config?.details?.signer?.is_current && !window.location.pathname.includes('user/dashboard')) {
        setCurrentItem({
          ...item,
          config: {
            ...item.config,
            details: {
              ...item?.config?.details,
              position: {
                ...item?.config?.details?.position,
                value: ''
              },
              signer: {
                ...item?.config?.details?.signer,
                value: '',
                imgValue: '',
                selectMode: true
              }
            }
          }
        })
      } else {
        setCurrentItem(item)
      }
    }

    // setIsDisplayCurrent(
    //   item?.config?.details?.signer?.is_current && window.location.pathname.includes('user/dashboard')
    // )
  }, [item])

  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState('')
  const [editedText, setEditedText] = useState('')

  // 3. Use useEffect to keep `text` and `editedText` in sync with `currentItem`.
  useEffect(() => {
    const positionValue = currentItem?.config?.details?.position?.value || 'จะปรากฏเมื่อลงนาม'
    setText(positionValue)
    if (!isEditing) {
      // Only update editedText if not in editing mode to avoid overwriting user input
      setEditedText(positionValue)
    }

    // console.log('currentItem', currentItem)
  }, [currentItem, isEditing])

  const handleDoubleClick = () => {
    if (currentItem?.config?.details?.signer?.is_current) {
      setIsEditing(true)
      setEditedText(text) // Initialize editor with current text
    }
  }

  const handleChange = (event: any) => {
    setEditedText(event.target.value)
  }

  const handleRemoveSignature = () => {
    setCurrentItem((prevItem: any) => ({
      ...prevItem,
      config: {
        ...prevItem.config,
        details: {
          ...prevItem?.config?.details,
          position: {
            ...prevItem?.config?.details?.position,
            value: ''
          },
          signer: {
            ...prevItem?.config?.details?.signer,
            value: '',
            imgValue: '',
            selectMode: true
          }
        }
      }
    }))
  }

  const handleSave = async () => {
    // setText(editedText) // Optimistically update the UI
    // setIsEditing(false)
    // console.log('currentItem', currentItem)
    try {
      const request = {
        form_data_id: form.formDataId,
        signature_id: currentItem.id,
        data: {
          position_name: editedText || ''
        }
      }
      const response = await replaceSignatrueForm({ request })
      if (response?.code == 'SUCCESS') {
        toast.success(dictionary?.updateSuccessful, { autoClose: 3000 })

        setCurrentItem((prevItem: any) => ({
          ...prevItem,
          config: {
            ...prevItem.config,
            details: {
              ...prevItem.config.details,
              position: {
                ...prevItem.config.details.position,
                value: editedText
              }
            }
          }
        }))
      }
    } catch (error) {
      console.log('error', error)
      toast.error(dictionary?.updatefailed, { autoClose: 3000 })
      // Optional: Revert text on failure
      // setText(currentItem?.config?.details?.position?.value || 'จะปรากฏเมื่อลงนาม')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedText(text) // Revert to original text
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      handleCancel()
    }
  }

  const onConfirmSelectSignature = async (items: any) => {
    const data = items[0]
    try {
      const request = {
        form_data_id: form.formDataId,
        signature_id: currentItem.id,
        data: {
          department_name: data.departmentName,
          is_current: false,
          person_id: String(data.id),
          person_name: data.name,
          position_name: data.personName
        }
      }
      const response = await selectSignatrueForm({ request })
      if (response?.code == 'SUCCESS') {
        toast.success(dictionary?.updateSuccessful, { autoClose: 3000 })

        const imgValue = `${process.env.NEXT_PUBLIC_SIGNER_IMAGE_URL}/${data?.id}`
        setCurrentItem((prevItem: any) => ({
          ...prevItem,
          config: {
            ...prevItem.config,
            details: {
              ...prevItem?.config?.details,
              position: {
                ...prevItem?.config?.details?.position,
                value: data.personName
              },
              signer: {
                ...prevItem?.config?.details?.signer,
                value: data.name,
                imgValue,
                selectMode: true
              }
            }
          }
        }))
      }
    } catch (error) {
      console.log('error', error)
      toast.error(dictionary?.updatefailed, { autoClose: 3000 })
    }
  }

  let isCurrenStyle = {}
  let isCurrenStyleImage = {}

  if (currentItem?.config?.details?.signer?.is_current) {
    isCurrenStyleImage = { opacity: 0.3 }
    isCurrenStyle = {
      borderColor: 'blue',
      borderWidth: '2px'
    }
  }

  // The rest of the JSX remains the same, as it already reads from `currentItem`.
  return (
    <div
      className='w-full mx-auto '
      style={{
        opacity: currentItem?.config?.details?.isShow ? 1 : 0,
        ...isCurrenStyle
      }}
    >
      <div className='rounded-sm text-start   p-4 border-b-2 relative border-gray-500 flex items-end justify-center gap-2'>
        {currentItem?.config?.details?.tag?.isShow && (
          <Typography
            variant='h6'
            style={{
              fontSize: currentItem?.config?.style?.fontSize ?? 16
            }}
          >
            {currentItem?.config?.details?.tag?.value}
          </Typography>
        )}

        {currentItem?.config?.details?.setting?.isUserUse &&
          currentItem?.config?.details?.signer?.value &&
          currentItem?.config?.details?.signer?.isShow &&
          currentItem?.config?.details?.signer?.selectMode && (
            <div
              onClick={() =>
                showDialog({
                  id: 'alertDialogConfirmToggleTrigger',
                  component: (
                    <ConfirmAlert
                      id='alertDialogConfirmToggleTrigger'
                      title='ลบลายเซ็นต์'
                      content1='คุณต้องการลบลายเซ็นต์นี้ ใช่หรือไม่'
                      onClick={handleRemoveSignature}
                    />
                  ),
                  size: 'sm'
                })
              }
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: 'rgba(0,0,0,0.112)',
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

        <div className='flex min-w-[200px] relative'>
          {!currentItem?.config?.details?.signer?.signature ? (
            <img
              src={'/images/signImg.png'} // <-- ❗️ แก้เป็น path รูปภาพลายน้ำของคุณ
              alt='ลายน้ำ'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain', // หรือ 'cover' ตามความเหมาะสม
                opacity: 0.2, // ✨ ปรับความโปร่งใสที่นี่ (ค่าระหว่าง 0.0 ถึง 1.0)
                pointerEvents: 'none' // เพื่อให้คลิกทะลุลายน้ำไปได้
              }}
            />
          ) : null}

          <img
            src={
              currentItem?.config?.details?.signer?.signature_base64 ||
              currentItem?.config?.details?.signer?.imgValue ||
              '/images/signImg.png'
            }
            alt='ลายเซ็นต์'
            style={{
              opacity: 1,
              width: '100%',
              height: '40px',
              objectFit: 'contain'
            }}
          />

          {currentItem?.config?.details?.signer?.signature ? (
            <CheckCircle
              color='success'
              className='mt-2 cursor-pointer'
              titleAccess={currentItem?.config?.details?.signer?.signature}
              onClick={() => {
                showDialog({
                  id: 'alertDialogConfirmToggleTrigger',
                  component: (
                    <Alert
                      id='alertDialogConfirmToggleTrigger'
                      title='Signature'
                      content1={'วันที่ ' + formatThaiDate(currentItem?.config?.details?.signer?.signed_date)}
                      content2={currentItem?.config?.details?.signer?.signature}
                      onClick={() => {}}
                    />
                  ),
                  size: 'sm'
                })
              }}
            />
          ) : null}

          {currentItem?.config?.details?.setting?.isUserUse &&
            !(
              currentItem?.config?.details?.signer?.signature_base64 || currentItem?.config?.details?.signer?.imgValue
            ) && (
              <Button
                variant='contained'
                fullWidth
                className=' absolute top-[0px] left-[0px] p-1 text-sm h-full'
                onClick={() => {
                  showDialog({
                    id: 'alertSettingSignDialog',
                    component: (
                      <SettingSignDialog
                        id='alertSettingSignDialog'
                        onConfirmSelectSignature={onConfirmSelectSignature}
                      />
                    ),
                    size: 'md'
                  })
                }}
              >
                เลือก
              </Button>
            )}
        </div>

        {currentItem?.config?.details?.endTag?.isShow && currentItem?.config?.details?.endTag?.value && (
          <Typography
            variant='h6'
            className=' text-nowrap'
            style={{
              fontSize: currentItem?.config?.style?.fontSize ?? 16
            }}
          >
            {currentItem?.config?.details?.endTag?.value}
          </Typography>
        )}
      </div>

      {currentItem?.config?.details?.signer?.isShow && (
        <Typography
          className={`text-center italic mt-2  ${currentItem?.config?.details?.signer?.value ? ' text-textPrimary' : undefined}`}
          variant={currentItem?.config?.details?.signer?.value ? 'h6' : 'body2'}
          style={{
            opacity: currentItem?.config?.details?.signer?.isShow ? 1 : 0,
            fontSize: currentItem?.config?.style?.fontSize ?? 16
          }}
        >
          {currentItem?.config?.details?.signer?.value
            ? currentItem?.config?.details?.signer?.value
            : 'ชื่อตัวพิมพ์จะปรากฏเมื่อลงนาม'}
        </Typography>
      )}

      <div className='mt-2 space-y-2  flex items-center flex-col'>
        {currentItem?.config?.details?.position?.isShow && (
          <div className='flex gap-4 justify-start'>
            <Typography
              variant='h6'
              style={{
                fontSize: currentItem?.config?.style?.fontSize ?? 16
              }}
            >
              ตำแหน่ง
            </Typography>
            {isEditing ? (
              <>
                <TextField
                  value={editedText}
                  onChange={handleChange}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  variant='standard'
                  autoFocus
                  size='small'
                  sx={{ flexGrow: 1 }}
                  style={{
                    fontSize: currentItem?.config?.style?.fontSize ?? 16
                  }}
                />
                <Button onClick={handleSave} size='small'>
                  <Check />
                </Button>
              </>
            ) : (
              <Typography
                className={`text-center text-textPrimary${currentItem?.config?.details?.position?.value ? '' : ' italic text-textDisabled'}`}
                variant='body2'
                onClick={handleDoubleClick}
                sx={{ cursor: 'pointer', flexGrow: 1 }}
                style={{
                  fontSize: currentItem?.config?.style?.fontSize ?? 16
                }}
              >
                {text}
              </Typography>
            )}
          </div>
        )}

        {currentItem?.config?.details?.date?.isShow && (
          <div className='flex gap-4 justify-start'>
            <Typography
              variant='h6'
              style={{
                fontSize: currentItem?.config?.style?.fontSize ?? 16
              }}
            >
              วันที่
            </Typography>
            {currentItem?.config?.details?.date?.value ? (
              <Typography
                className='text-center'
                variant='body2'
                style={{
                  fontSize: currentItem?.config?.style?.fontSize ?? 16
                }}
              >
                {currentItem?.config?.details?.date?.value}
              </Typography>
            ) : (
              <Typography
                className='text-center italic text-textDisabled'
                variant='body2'
                style={{
                  fontSize: currentItem?.config?.style?.fontSize ?? 16
                }}
              >
                จะปรากฏเมื่อลงนาม
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SignatureForm

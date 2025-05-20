'use client'
import { useEffect, useRef } from 'react'
import { Button, Typography } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import SettingSignDialog from '@/components/dialogs/form/SettingSignDialog'
import { DeleteOutlined } from '@mui/icons-material'
import ConfirmAlert from '@/components/dialogs/alerts/ConfirmAlert'
import { useFormStore } from '@/store/useFormStore'

const SignatureForm = ({ item }: any) => {
  const { showDialog } = useDialog()
  const form = useFormStore(state => state.form)
  let currentItem = item

  if (item?.config?.details?.signType?.type === 'clone' && item?.config?.details?.signType?.formId) {
    const cloned = form?.form_details
      .flatMap(section => section.fields)
      .flatMap(field => field.data)
      .find(dataItem => dataItem.id === item.config.details.signType.formId)

    if (cloned) {
      currentItem = cloned
    }
  }

  return (
    <div className='w-full mx-auto ' style={{ opacity: currentItem?.config?.details?.isShow ? 1 : 0 }}>
      <div className='bg-gray-100 rounded-sm text-start  p-4 border-b-2 relative border-gray-500 flex items-end justify-center gap-2'>
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
          currentItem?.config?.details?.signer?.isShow && (
            <div
              onClick={() =>
                showDialog({
                  id: 'alertDialogConfirmToggleTrigger',
                  component: (
                    <ConfirmAlert
                      id='alertDialogConfirmToggleTrigger'
                      title='ลบลายเซ็นต์'
                      content1='คุณต้องการลบลายเซ็นต์นี้ ใช่หรือไม่'
                      onClick={() => {
                        // updateDetails(
                        //   String(selectedField?.parentKey ?? ''),
                        //   selectedField?.boxId ?? '',
                        //   selectedField?.fieldId?.id ?? '',
                        //   {
                        //     value: toolboxDocumentBaseMenu[2]?.config?.details?.value
                        //   }
                        // )
                      }}
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
          <img
            src='/images/signImg.jpg'
            alt='ลายเซ็นต์จะปรากฏเมื่อลงนาม'
            style={{
              opacity: 1,
              width: '100%',
              height: '40px',
              objectFit: 'contain'
            }}
          />
          {currentItem?.config?.details?.setting?.isUserUse && (
            <Button
              variant='contained'
              fullWidth
              className=' absolute top-[0px] left-[0px] p-1 text-sm h-full'
              onClick={() => {
                showDialog({
                  id: 'alertSettingSignDialog',
                  component: <SettingSignDialog id='alertSettingSignDialog' onClick={() => {}} />,
                  size: 'sm'
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
            {currentItem?.config?.details?.position?.value ? (
              <Typography
                className='text-center'
                variant='body2'
                style={{
                  fontSize: currentItem?.config?.style?.fontSize ?? 16
                }}
              >
                {currentItem?.config?.details?.position?.value}
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

'use client'
import { useEffect, useRef } from 'react'
import { Button, Typography } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import SettingSignDialog from '@/components/dialogs/form/SettingSignDialog'

const SignatureForm = ({ item }: any) => {
  const { showDialog } = useDialog()
  const divRef = useRef(null)

  const handleSelectText = () => {
    if (divRef.current) {
      const range = document.createRange()
      range.selectNodeContents(divRef.current)
      const selection = window.getSelection()
    }
  }

  return (
    <div className='w-full mx-auto ' style={{ opacity: item?.config?.details?.isShow ? 1 : 0 }}>
      <div className='bg-gray-100 rounded-sm text-start  p-4 border-b-2 border-gray-500 relative'>
        {item?.config?.details?.tag?.isShow && (
          <Typography variant='h6'>{item?.config?.details?.tag?.value}</Typography>
        )}
        {item?.config?.details?.setting?.defaultAssign !== 'owner' && (
          <Button
            variant='contained'
            className=' absolute top-[5px] right-[5px] p-1 text-sm'
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

        <Typography
          variant={item?.config?.details?.signer?.value ? 'h6' : 'body1'}
          style={{
            opacity: item?.config?.details?.signer?.isShow ? 1 : 0,
            fontSize: item?.config?.style?.fontSize ?? 16
          }}
        >
          ลายเซ็นต์จะปรากฏเมื่อลงนาม
        </Typography>
      </div>

      <Typography
        className={`text-start italic mt-2 text- pl-4 ${item?.config?.details?.signer?.value ? ' text-textPrimary' : undefined}`}
        variant={item?.config?.details?.signer?.value ? 'h6' : 'body2'}
        style={{ opacity: item?.config?.details?.signer?.isShow ? 1 : 0 }}
      >
        {item?.config?.details?.signer?.value ? item?.config?.details?.signer?.value : 'ชื่อตัวพิมพ์จะปรากฏเมื่อลงนาม'}
      </Typography>

      <div className='mt-2 space-y-2 pl-4'>
        {item?.config?.details?.position?.isShow && (
          <div className='flex gap-4 justify-start'>
            <Typography variant='h6'>ตำแหน่ง</Typography>
            {item?.config?.details?.position?.value ? (
              <Typography className='text-center' variant='body2'>
                {item?.config?.details?.position?.value}
              </Typography>
            ) : (
              <Typography className='text-center italic text-textDisabled' variant='body2'>
                จะปรากฏเมื่อลงนาม
              </Typography>
            )}
          </div>
        )}
        {item?.config?.details?.date?.isShow && (
          <div className='flex gap-4 justify-start'>
            <Typography variant='h6'>วันที่</Typography>
            {item?.config?.details?.date?.value ? (
              <Typography className='text-center' variant='body2'>
                {item?.config?.details?.date?.value}
              </Typography>
            ) : (
              <Typography className='text-center italic text-textDisabled' variant='body2'>
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

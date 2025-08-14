'use client'

// MUI Imports
import { Button, Grid } from '@mui/material'
import { Draw } from '@mui/icons-material'

// React Imports
import React, { useState } from 'react'

// Hook Imports
import { useDialog } from '@/hooks/useDialog'
import { useFormStore } from '@/store/useFormStore'
import { useDictionary } from '@/contexts/DictionaryContext'

// Dialog and Component Imports
import NormalSignDialog from '@/components/dialogs/sign/NormalSignDialog'
import ElectonicSignDialog from '@/components/dialogs/sign/ElectonicSignDialog'
import CertifySignDialog from '@/components/dialogs/sign/CertifySignDialog'
import OtpSignDialog from '@/components/dialogs/sign/OtpSignDialog'
import CommentSignDialog from '@/components/dialogs/sign/CommentSignDialog'

// Utility Imports
import { toast } from 'react-toastify'

const ActionButtons = ({ data, handleSaveStartflow, isView = true }: any) => {
  // ** Hooks
  const { showDialog } = useDialog()
  const { dictionary } = useDictionary()

  // ** State
  const [isStartSign, setIsStartSign] = useState(false)
  const [linkIdButton, setLinkIdButton] = useState<number | null>(null)

  // ** Zustand Store
  const validateForm = useFormStore(state => state.validateForm)

  return (
    <Grid item xs={12} className='flex items-center justify-end gap-2'>
      <div className='flex gap-2 items-center overflow-auto flex-nowrap min-w-0 pb-2'>
        {!isView ? (
          isStartSign ? (
            <div className='flex gap-2 items-center min-w-max'>
              <Button variant='contained' color='inherit' onClick={() => setIsStartSign(false)} className='self-start'>
                กลับ
              </Button>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Draw />}
                onClick={() => {
                  showDialog({
                    id: 'alertSignDialog',
                    component: (
                      <NormalSignDialog
                        id='alertSignDialog'
                        onSave={comment => handleSaveStartflow(comment, '6', undefined, linkIdButton)}
                        signType='6'
                      />
                    ),
                    size: 'sm'
                  })
                }}
              >
                ลงนาม
              </Button>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Draw />}
                onClick={() => {
                  showDialog({
                    id: 'alertSignElectonicSignDialog',
                    component: (
                      <ElectonicSignDialog
                        id='alertSignElectonicSignDialog'
                        onSave={(comment, _, signatureBase64) =>
                          handleSaveStartflow(comment, '7', signatureBase64, linkIdButton)
                        }
                        signType='7'
                      />
                    ),
                    size: 'sm'
                  })
                }}
              >
                ลงนาม - ลายมือชื่ออิเล็กทรอนิกส์ (ม.9)
              </Button>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Draw />}
                onClick={() => {
                  showDialog({
                    id: 'alertCertifySignDialog',
                    component: (
                      <CertifySignDialog
                        id='alertCertifySignDialog'
                        onSave={comment => handleSaveStartflow(comment, '1', undefined, linkIdButton)}
                        signType='1'
                      />
                    ),
                    size: 'sm'
                  })
                }}
              >
                ลงนาม (ใบรับรองอิเล็กทรอนิกส์)
              </Button>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Draw />}
                onClick={() => {
                  showDialog({
                    id: 'alertSignOtpSignDialog',
                    component: (
                      <OtpSignDialog
                        id='alertSignOtpSignDialog'
                        onSave={comment => handleSaveStartflow(comment, '8', undefined, linkIdButton)}
                        signType='8'
                      />
                    ),
                    size: 'sm'
                  })
                }}
              >
                ลงนาม OTP
              </Button>
            </div>
          ) : (
            <div className='flex justify-end flex-nowrap min-w-max gap-2'>
              {data?.flow_activity_link?.map((item: any, index: number) => (
                <Button
                  key={index}
                  variant='contained'
                  onClick={() => {
                    const isValid = validateForm()
                    if (!isValid) {
                      toast.error('โปรดกรอกข้อมูลให้ครบถ้วน')
                      return
                    }
                    setLinkIdButton(item?.link_id)
                    if (item?.signId) {
                      setIsStartSign(true)
                    } else {
                      showDialog({
                        id: 'alertCommentSignDialog',
                        component: (
                          <CommentSignDialog
                            id='alertCommentSignDialog'
                            onSave={comment => handleSaveStartflow(comment, '6', undefined, item?.link_id)}
                            linkId={item?.link_id}
                            title={item?.text}
                            signType='6'
                          />
                        ),
                        size: 'sm'
                      })
                    }
                  }}
                >
                  {item?.text}
                </Button>
              ))}
            </div>
          )
        ) : null}
      </div>
    </Grid>
  )
}

export default ActionButtons

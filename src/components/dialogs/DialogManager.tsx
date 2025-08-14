'use client'

import React from 'react'
import { Dialog, DialogContent } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import DialogCloseButton from './DialogCloseButton'

const DialogManager = () => {
  const { dialogs, closeDialog } = useDialog()

  return (
    <>
      {dialogs.map(dialog => (
        <Dialog
          fullWidth
          fullScreen={false}
          maxWidth={dialog.size}
          key={dialog.id}
          open={true}
          onClose={(_, reason) => {
            // ถ้ากด backdrop แล้ว dialog.closeOnBackdropClick === false → ไม่ปิด
            if (reason === 'backdropClick' && dialog.closeOnBackdropClick === false) return
            closeDialog(dialog.id)
          }}
          sx={{
            '& .MuiDialog-paper': { overflow: 'visible' }
          }}
        >
          <DialogCloseButton onClick={() => closeDialog(dialog.id)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <DialogContent className='overflow-auto'>
            {React.isValidElement(dialog.component) && React.cloneElement(dialog.component, { ...dialog.props })}
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
}

export default DialogManager

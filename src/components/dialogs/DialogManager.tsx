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
          // fullWidth={dialog.size == 'sm' ? true : false}
          fullWidth={true}
          fullScreen={false}
          maxWidth={dialog.size == 'sm' ? 'sm' : 'md'}
          key={dialog.id}
          open={true}
          onClose={() => closeDialog(dialog.id)}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogCloseButton onClick={() => closeDialog(dialog.id)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <DialogContent className='  flex items-center justify-center'>
            {React.isValidElement(dialog.component) && React.cloneElement(dialog.component, { ...dialog.props })}
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={() => closeDialog(dialog.id)}>Close</Button>
          </DialogActions> */}
        </Dialog>
      ))}
    </>
  )
}

export default DialogManager

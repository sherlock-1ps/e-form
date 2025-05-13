'use client'
import React, { createContext, useState, useCallback } from 'react'

interface DialogProps {
  id: string
  component: React.ReactNode
  props?: any
  size?: 'sm' | 'md' | 'lg'
}

interface DialogContextProps {
  dialogs: DialogProps[]
  showDialog: (dialog: DialogProps) => void
  closeDialog: (id: string) => void
}

export const DialogContext = createContext<DialogContextProps | undefined>(undefined)

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogs, setDialogs] = useState<DialogProps[]>([])

  const showDialog = useCallback((dialog: DialogProps) => {
    setDialogs(prevDialogs => [...prevDialogs, dialog])
  }, [])

  const closeDialog = useCallback((id: string) => {
    setDialogs(prevDialogs => prevDialogs.filter(dialog => dialog.id !== id))
  }, [])

  return <DialogContext.Provider value={{ dialogs, showDialog, closeDialog }}>{children}</DialogContext.Provider>
}

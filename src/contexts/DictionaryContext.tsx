// src/context/DictionaryContext.tsx
'use client'

import { createContext, useContext } from 'react'

type DictionaryContextType = {
  dictionary: Record<string, any>
  locale: string
}

const DictionaryContext = createContext<DictionaryContextType | null>(null)

export const DictionaryProvider = ({
  children,
  dictionary,
  locale
}: {
  children: React.ReactNode
  dictionary: Record<string, any>
  locale: string
}) => {
  return <DictionaryContext.Provider value={{ dictionary, locale }}>{children}</DictionaryContext.Provider>
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext)
  if (!context) throw new Error('useDictionary must be used inside DictionaryProvider')

  return context
}

import { create } from 'zustand'

type WatchFormState = {
  isWatchForm: boolean
  setWatchFormTrue: () => void
  setWatchFormFalse: () => void
}

export const useWatchFormStore = create<WatchFormState>()(set => ({
  isWatchForm: false,
  setWatchFormTrue: () => set({ isWatchForm: true }),
  setWatchFormFalse: () => set({ isWatchForm: false })
}))

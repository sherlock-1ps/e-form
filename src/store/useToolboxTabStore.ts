import { create } from 'zustand'

type ToolboxTab = 'document' | 'popup' | 'appState' | 'apiCall' | 'media' | 'workflow'

type ToolboxTabState = {
  activeTab: ToolboxTab
  setActiveTab: (tab: ToolboxTab) => void
  clear: () => void
}

export const useToolboxTabStore = create<ToolboxTabState>((set) => ({
  activeTab: 'document',
  setActiveTab: (tab) => set({ activeTab: tab }),
  clear: () => set({ activeTab: 'document' })  // ← reset to default
}))

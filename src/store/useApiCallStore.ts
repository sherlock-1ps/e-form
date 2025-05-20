import { create } from "zustand";

type ApiItem = {
  name: string
  method: string
  url: string
  headers: any
  body: any
  id?: any
}

type ApiUrlState = {
  apiLists: ApiItem[]
  selectedApi: ApiItem | null
  setSelectedApi: (api: ApiItem | null) => void
  addApis: (newApis: ApiItem[]) => void
}

export const useApiCallStore = create<ApiUrlState>()((set) => ({
  apiLists: [],
  selectedApi: null,
  setSelectedApi: (api) => set({ selectedApi: api }),
  addApis: (newApis) =>
    set((state) => ({
      apiLists: [...newApis]
    }))
}))

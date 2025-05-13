import { create } from "zustand";

type ApiItem = {
  name: string
  method: string
  url: string
}

type ApiUrlState = {
  apiLists: ApiItem[]
  selectedApi: ApiItem | null
  setSelectedApi: (api: ApiItem | null) => void
}

export const useApiCallStore = create<ApiUrlState>()((set) => ({
  apiLists: [
    {
      name: 'testAPI',
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1'
    },
    {
      name: 'testAPI',
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts/2'
    },
    {
      name: 'API1234',
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/3'
    },
    {
      name: 'APICALL',
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts/4'
    },
  ],
  selectedApi: null,
  setSelectedApi: (api) => set({ selectedApi: api })
}))

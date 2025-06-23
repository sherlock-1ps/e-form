import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  profile: any
  urlBase: string | null
  urlLogin: string | null

  setTokens: (accessToken: string) => void
  setProfile: (profile: any) => void
  clearTokens: () => void
  setUrlBase: (urlBase: string) => void
  setUrlLogin: (urlLogin: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      profile: null,
      urlBase: '',
      urlLogin: '',
      setTokens: accessToken => set({ accessToken }),
      setProfile: profile => set({ profile }),
      clearTokens: () => set({ accessToken: null, profile: null }),
      setUrlBase: urlBase => set({ urlBase }),
      setUrlLogin: urlLogin => set({ urlLogin })
    }),
    {
      name: 'auth-storage'
    }
  )
)

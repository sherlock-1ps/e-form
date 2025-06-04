import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null
  profile: any
  setTokens: (accessToken: string) => void
  setProfile: (profile: any) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      profile: null,
      setTokens: (accessToken) => set({ accessToken }),
      setProfile: (profile) => set({ profile }),
      clearTokens: () => set({ accessToken: null, profile: null }),
    }),
    {
      name: "auth-storage",

    }
  )
)



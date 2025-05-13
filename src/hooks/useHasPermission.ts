import { useAuthStore } from "@/store/useAuthStore"

export const useHasPermission = () => {
  const permissions = useAuthStore(state => state.profile?.permission || [])

  const hasPermission = (perm: string) => {
    return permissions.includes(perm)
  }

  const hasAnyPermission = (perms: string[]) => {
    return perms.some(p => permissions.includes(p))
  }

  return {
    hasPermission,
    hasAnyPermission,
    allPermissions: permissions
  }
}

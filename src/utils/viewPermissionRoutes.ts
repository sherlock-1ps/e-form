export const viewPermissionToRouteMap: Record<string, string> = {
  '15': 'overview',
  // '16': 'provider',
  '17': 'credential',
  '18': 'transaction',
  '19': 'invoice',
  '20': 'auditlog',
  '21': 'account',
  '22': 'role'
}

export const extractViewRoutesFromPermissions = (permissions: string[]): string[] => {
  const permissionRoutes = permissions
    .filter(p => p.startsWith('view-operator-'))
    .map(p => p.split('view-operator-')[1])
    .filter(id => viewPermissionToRouteMap[id])
    .map(id => viewPermissionToRouteMap[id])

  return [...permissionRoutes, 'faq']
}

export const adminGroupId: string[] = ['1005', '1006', '1026']

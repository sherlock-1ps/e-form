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

export const getAuthFromStorage = () => {
  const storedData = localStorage.getItem('auth-storage')
  if (!storedData) {
    return null
  }
  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.error("Error parsing 'auth-storage' from localStorage:", error)
    return null
  }
}

interface UserInformation {
  F_PERSON_ID: number
  F_FIRST_NAME: string
  F_LAST_NAME: string
  F_ENG_FIRST_NAME: string
  F_ENG_LAST_NAME: string
  F_DEPT_ID: number
  F_NAME: string
  F_SHORT_NAME: string
  F_POSITION_ID: number
  F_POSITION_NAME: string
  F_CHECK_AD: number
  F_IS_AGREE_PDPA: number
  F_IS_AGREE: number
  F_LINE_USER_ID: string
  backendPermission: boolean
}

interface Profile {
  id: number
  email: string
  name: string
  F_PERSON_ID: number
  USER_GROUP_ID: number
  USER_GROUP_LISTS_ID: string[]
  userInformation: UserInformation
}

/**
 * แทนที่ placeholders ในสตริงด้วยข้อมูลจากอ็อบเจกต์ (TypeScript version)
 * @param templateString - สตริงที่มี placeholders เช่น "สวัสดี {F_FIRST_NAME}"
 * @param profile - อ็อบเจกต์ข้อมูลที่ตรงกับ Interface 'Profile'
 * @returns สตริงใหม่ที่ถูกแทนที่ข้อมูลแล้ว
 *
 * "ชื่อ: {F_FIRST_NAME} {F_LAST_NAME} ({F_ENG_FIRST_NAME}) ตำแหน่ง: {F_POSITION_NAME}"
 */
export const renderProfileTemplate = (templateString: string | undefined): string => {
  try {
    const session = getAuthFromStorage()

    const profile = session?.state?.profile || { userInformation: {} }

    const data: Record<string, any> = {
      ...profile,
      ...profile.userInformation
    }

    const regex = /\{(\w+)\}/g
    if (templateString) {
      return templateString.replace(regex, (match: string, key: string): string => {
        return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : match
      })
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

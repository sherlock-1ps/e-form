export type permissionRoleType = {
  id: number | string
  name: string
  groups: permissionGroupType[]
}

export type permissionGroupType = {
  id: number | string
  name: string
  actions: permissionActionType[]
}

export type permissionActionType = {
  id: number | string
  name: string
  preview_image: any
  is_active: boolean
}

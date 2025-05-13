export type RoleListType = {
  id: number
  name: string
  icon: string | number
  description: string
  user: []
  permissions: []
}

export type CreateRoleType = {
  name: string
  description: string
  icon: string | number
}

export type UpdateRoleType = {
  role_id: number | string
  name: string
  description: string
  icon: string | number
}

export type DeleteRoleType = {
  id: number
}

export type GetRoleUserManagementType = {
  role_id: number | string
}

export type UpdateUserToRole = {
  role_id: number | string
  removed_user_list: number[] | string[]
  add_user_list: number[] | string[]
}

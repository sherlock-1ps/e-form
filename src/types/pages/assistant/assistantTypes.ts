export type AssistantType = {
  id: number
  username: string
  phone_number: string
  description: string
  profile_image: string
  is_active: boolean
  is_owner: boolean
  roles: []
  permissions: []
}

export type CreateAssistantType = {
  username: string
  password?: string
  confirm_password?: string
  phone_number: string
  profile_image?: any
  description?: string
  is_active?: boolean
  is_owner?: boolean
}
export type UpdateAssistantType = {
  user_id: number | string
  username: string
  phone_number: string
  description: any
  profile_image: string
}

export type DeleteAssistantType = {
  user_id: number
}

export type ChangePasswordAssistantType = {
  user_id: number | string
  new_password: string
  confirm_password: string
}

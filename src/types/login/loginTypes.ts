

export type UserRole = {
  role_id: string
  role_name: string
}

export type UserProfile = {
  role: UserRole
  operator_user_id: string
  operator_prefix: string
  operator_name: string
  email: string
  currency_code: string
  country_code: string
  timezone: string
  contract: string
  permission: string[]
  is_owner: boolean
  is_enable: boolean
  is_first_login: boolean
  is_two_fa: boolean
  two_fa_type: string
}

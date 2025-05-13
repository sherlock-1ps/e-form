export type AuditLogFilterPayload = {
  start_date?: string
  end_date?: string
  menu_index?: number
  action?: string[]
  email?: string
  page: number
  limit: number
}

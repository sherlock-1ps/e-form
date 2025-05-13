export type UpdateOperatorPayload = {
  operator_id: string; // ✅ Required
  operator_name?: string; // Optional
  operator_prefix?: string; // Optional
  email?: string; // Optional
  is_enable?: boolean; // Optional
  is_delete?: boolean; // Optional
};

export type ResetPasswordOperatorPayload = {
  email: string;
};

export type CreateOperatorPayload = {
  operator_prefix: string
  email: string
  password: string
  operator_name: string
  currency_code: string
  country_code: string
  timezone: string
  contract: string
}

export type ProviderCredentialType = {
  provider_credential_id: string
  provider_code: string
  provider_name: string
  image: string
  credential_percent: number
  currency_code: string
  is_enable?: boolean
  selectShare: number | string
  is_select: boolean
  percent_holder?: number
}

type CredentialProvider = {
  provider_code: string
  credential_percent: number
}

export type CreateCredentialPayload = {
  credential_prefix: string
  description?: string
  credential_provider: CredentialProvider[]
}


export type ProviderCredenitalExistPayload = {
  credential_id: string
  page: number
  limit: number
}

export type SearchCredentialProviderListPayload = {
  credential_id: string
  provider_name?: string
  category_code?: string
  page: number
  limit: number
}

export type CredentialProviderType = {
  provider_credential_id: string;
  provider_name: string;
  provider_code: string
  image: string;
  credential_percent: number;
  currency_code?: string;
  is_enable: boolean;
};

export type SearchGameCredentialProviderListPayload = {
  credential_id: string
  provider_name?: string
  category_code?: string
  page: number
  limit: number
}

export type AddCredentialProviderPayload = {
  credential_id: string
  credential_provider: CredentialProvider[]
}


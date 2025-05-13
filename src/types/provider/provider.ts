export type ProviderUpdatePayload = {
  provider_id: string;
  provider_code?: string;
  provider_name?: string;
  is_enable?: boolean;
  image?: any;
  currencies_code?: string[];
  percent_holder?: number;
  secret_key?: string;
  encrypt_key?: string;
  config?: string;
  remark?: string;
  categories_code?: string[];
};


export type GameProviderUpdatePayload = {
  game_id: string;
  game_code?: string;
  game_name?: string;
  provider?: string;
  is_enable?: boolean;
  image?: any;
  category?: string;
};

export type CreateGameProviderPayload = {
  game_code: string;
  game_name: string;
  provider_code: string;
  image: string;
  category: string;
};

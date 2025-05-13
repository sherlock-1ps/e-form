import { fetchGameProvider, fetchProviderCurrency, fetchProviders, fetchProviderType } from "@/app/sevices/provider/provider";

export default function fetchProviderQueryOption(page: number, pageSize: number) {
  return {
    queryKey: ["providers", page, pageSize],
    queryFn: () => fetchProviders({ page, pageSize }),
  };
}

export function fetchProviderTypeQueryOption() {
  return {
    queryKey: ['typeProviders'],
    queryFn: fetchProviderType
  };
}

export function fetchCurrencyProviderQueryOption() {
  return {
    queryKey: ['currencyProviders'],
    queryFn: fetchProviderCurrency
  };
}

export function fetchGamesProviderQueryOption(page: number, pageSize: number, provider: string) {
  return {
    queryKey: ['gameProvider', page, pageSize],
    queryFn: () => fetchGameProvider({ page, pageSize, provider_code: provider ?? '' })
  };
}

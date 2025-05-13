/* eslint-disable react-hooks/rules-of-hooks */
import { fetchProvider } from "@/app/sevices/config/configService";
import { addNewProviderCredential, createCredential, fetchCredential, fetchGameProvider, fetchNewGameProviderCredenital, fetchProviderCredenitalExist, searchCredential, searchGameProvider, searchProviderCredenitalExist, updateGameStatus, updateStatusCredential, updateStatusProviderCredenitalExist } from "@/app/sevices/credential/credentialService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function fetchCredentialQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: () => fetchCredential({ page, pageSize }),
  });
}

export const useSearchCredentialMutationOption = () => {

  return useMutation({
    mutationFn: searchCredential,
    onError: (error) => {
      console.error("Error search credential:", error);
    },

  });
};

export const useUpdateCredentialMutationOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusCredential,
    onError: (error) => {
      console.error("Error updating status credential:", error);
    },

  });
};

export function useFetchProviderCredentialMutationOption() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: () => fetchProvider(),
  });
}

export const useCreateCredentialMutationOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCredential,
    onError: (error) => {
      console.error("Error create credential:", error);
    },

  });
};



export function useFetchCredentialProviderListQueryOption({
  page,
  limit,
  credential_id
}: {
  page: number
  limit: number
  credential_id: string
}) {
  return useQuery({
    queryKey: ["providersExist"],
    queryFn: () => fetchProviderCredenitalExist({ page, limit, credential_id }),
  });
}

export const useSearchCredentialProviderListQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: searchProviderCredenitalExist,
    onError: (error) => {
      console.error("Error search provider credential:", error);
    },

  });
};

export const useUpdateStatusCredentialProviderListQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusProviderCredenitalExist,
    onError: (error) => {
      console.error("Error update status provider credential:", error);
    },

  });
};

export const useAddProviderCredentialListQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewProviderCredential,
    onError: (error) => {
      console.error("Error add new provider credential:", error);
    },

  });
};

export const useFetchGameCredentialListQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchNewGameProviderCredenital,
    onError: (error) => {
      console.error("Error fetch new provider credential:", error);
    },

  });
};


export function useFetchGameProviderListQueryOption({
  page,
  pageSize,
  provider_credential_id
}: {
  page: number
  pageSize: number
  provider_credential_id: string
}) {
  return useQuery({
    queryKey: ["gameProvider"],
    queryFn: () => fetchGameProvider({ page, pageSize, provider_credential_id }),
  });
}

export const useSearchGameCredentialListQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: searchGameProvider,
    onError: (error) => {
      console.error("Error search new provider credential:", error);
    },

  });
};

export const useUpdateStatusGameCredentialListQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGameStatus,
    onError: (error) => {
      console.error("Error update status game:", error);
    },

  });
};

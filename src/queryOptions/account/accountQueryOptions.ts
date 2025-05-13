/* eslint-disable react-hooks/rules-of-hooks */

import { changeRoleAccount, createOperator, fetchAccount, searchAccount, updateStatusAccount } from '@/app/sevices/account/account';
import { fetchConfigRole, } from '@/app/sevices/config/configService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useFetchAccountQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => fetchAccount({ page, pageSize }),
  });
}

export const useSearchAccountQueryOption = () => {

  return useMutation({
    mutationFn: searchAccount,
    onError: (error) => {
      console.error("Error search account:", error);
    },

  });
};

export const useCreateAccountQueryOption = () => {

  return useMutation({
    mutationFn: createOperator,
    onError: (error) => {
      console.error("Error create account:", error);
    },

  });
};
export const useChangeRoleAccountOwnerMutationOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeRoleAccount,
    onError: (error) => {
      console.error("Error change role account:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },

  });
};

export const useUpdateStatusAccountQueryOption = () => {

  return useMutation({
    mutationFn: updateStatusAccount,
    onError: (error) => {
      console.error("Error update status account:", error);
    },

  });
};


export function useFetchRoleQueryOption() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchConfigRole(),
  });
}








/* eslint-disable react-hooks/rules-of-hooks */
import { createOperator, fetchOperator, updateOperator } from "@/app/sevices/operator/operator";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function fetchOperatorQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["operators", page, pageSize],
    queryFn: () => fetchOperator({ page, pageSize }),
  });
}

export const useCreateOperatorMutationOption = () => {

  return useMutation({
    mutationFn: createOperator,
    onError: (error) => {
      console.error("Error create operator:", error);
    },

  });
};

export const useUpdateOperatorMutationOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOperator,
    onError: (error) => {
      console.error("Error updating operator:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    },
  });
};



export const useResetPasswordOperatorMutationOption = () => {

  return useMutation({
    mutationFn: updateOperator,
    onError: (error) => {
      console.error("Error reset password operator:", error);
    },

  });
};


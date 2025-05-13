/* eslint-disable react-hooks/rules-of-hooks */
import { createFaq, fetchFaq, searchFaq } from "@/app/sevices/faq/faq";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function fetchFaqQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["faq", page, pageSize],
    queryFn: () => fetchFaq({ page, pageSize }),
  });
}

export const useSearchFaqMutationOption = () => {

  return useMutation({
    mutationFn: searchFaq,
    onError: (error) => {
      console.error("Error search account owner:", error);
    },

  });
};

export const useCreateFaqMutationOption = () => {

  return useMutation({
    mutationFn: createFaq,
    onError: (error) => {
      console.error("Error create faq:", error);
    },

  });
};

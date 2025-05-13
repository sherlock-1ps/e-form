import { fetchDetailLog, getActionLog, getMenuLog, searchLog } from "@/app/sevices/auditlog/auditlogService";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchMenuLogMutationOption() {
  return useQuery({
    queryKey: ["menuLog"],
    queryFn: () => getMenuLog(),
  });
}

export function useFetchActionLogMutationOption() {
  return useQuery({
    queryKey: ["actionLog"],
    queryFn: () => getActionLog(),
  });
}

export const useSearchLogMutationOption = () => {

  return useMutation({
    mutationFn: searchLog,
    onError: (error) => {
      console.error("Error search log:", error);
    },

  });
};

export const useFetchDetailLogOwnerMutationOption = () => {

  return useMutation({
    mutationFn: fetchDetailLog,
    onError: (error) => {
      console.error("Error search log:", error);
    },

  });
};


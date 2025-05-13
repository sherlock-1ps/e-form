/* eslint-disable react-hooks/rules-of-hooks */

import { changeRoleAccount, createOperator, fetchAccount, searchAccount, updateStatusAccount } from '@/app/sevices/account/account';
import { createForm, createNewVersionForm, createVariable, deleteForm, deleteVariable, editVariable, fetchForm, fetchVariable, getForm, updateForm } from '@/app/sevices/form/formServices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'



export function useFetchFormQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["form"],
    queryFn: () => fetchForm({ page, pageSize }),
  });
}

export const useGetFormQueryOption = () => {

  return useMutation({
    mutationFn: getForm,
    onError: (error) => {
      console.error("Error get form:", error);
    },


  });
};

export const useCreateNewVersionFormQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewVersionForm,
    onError: (error) => {
      console.error("Error create new version form:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["form"] });
    },


  });
};

export const useCreateFormQueryOption = () => {

  return useMutation({
    mutationFn: createForm,
    onError: (error) => {
      console.error("Error create form:", error);
    },

  });
};

export const useUpdateFormQueryOption = () => {

  return useMutation({
    mutationFn: updateForm,
    onError: (error) => {
      console.error("Error update form:", error);
    },

  });
};

export const useDeleteFormQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteForm,
    onError: (error) => {
      console.error("Error delete form:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["form"] });
    },

  });
};


export function useFetchVariableQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["variable"],
    queryFn: () => fetchVariable({ page, pageSize }),
  });
}


export const useCreateVariableQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVariable,
    onError: (error) => {
      console.error("Error create variable:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variable"] });
    },

  });
};

export const useEditVariableQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editVariable,
    onError: (error) => {
      console.error("Error edit variable:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variable"] });
    },

  });
};

export const useDeleteVariableQueryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVariable,
    onError: (error) => {
      console.error("Error delete variable:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variable"] });
    },

  });
};



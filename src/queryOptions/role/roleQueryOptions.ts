import { createRole, deleteRole, editPermission, fetchPermission, fetchPermissionExist, fetchRole, searchRoleList, updateStatusRole } from "@/app/sevices/role/roleServices";
import { RoleExistPayload } from "@/types/role/roleTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchRoleQueryOption(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["roleList"],
    queryFn: () => fetchRole({ page, pageSize }),
  });
}

export const useSearchRoleListMutationOption = () => {

  return useMutation({
    mutationFn: searchRoleList,
    onError: (error) => {
      console.error("Error search roleList:", error);
    },

  });
};

export const useUpdateStatusRoleMutationOption = () => {

  return useMutation({
    mutationFn: updateStatusRole,
    onError: (error) => {
      console.error("Error update status roleList:", error);
    },

  });
};

export const useDeleteRoleMutationOption = () => {

  return useMutation({
    mutationFn: deleteRole,
    onError: (error) => {
      console.error("Error delete roleList:", error);
    },

  });
};

export const useCreateRoleMutationOption = () => {

  return useMutation({
    mutationFn: createRole,
    onError: (error) => {
      console.error("Error create roleList:", error);
    },

  });
};

export const useEditPermissionMutationOption = () => {

  return useMutation({
    mutationFn: editPermission,
    onError: (error) => {
      console.error("Error edit permission:", error);
    },

  });
};


export function useFetchPermissionQueryOption() {
  return useQuery({
    queryKey: ["permission"],
    queryFn: () => fetchPermission(),
  });
}

export function useFetchUpdatePermissionQueryOption(payload: RoleExistPayload) {
  return useQuery({
    queryKey: ["permissionExist"],
    queryFn: () => fetchPermissionExist(payload),
  });
}



import Axios from "@/libs/axios/axios";
import { EditPermissionsPayload, RoleExistPayload, RoleWithPermissions } from "@/types/role/roleTypes";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchRole = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/role/getList", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching role:", error);

    const e = axiosErrorHandler(error, '/role/getList')
    throw e;
  }

};

export const searchRoleList = async ({ page, pageSize, role_name }: { page: number; pageSize: number; role_name: string }) => {
  try {
    const response = await Axios.post("/role/search", {
      role_name,
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error searching role:", error);

    const e = axiosErrorHandler(error, '/role/search')
    throw e;
  }

};

export const updateStatusRole = async ({ is_enable, role_id }: { is_enable: boolean; role_id: string }) => {
  try {
    const response = await Axios.patch("/role/update/status", {
      role_id,
      is_enable,
    });

    return response.data;

  } catch (error) {
    console.error("Error update status role:", error);

    const e = axiosErrorHandler(error, '/role/update/status')
    throw e;
  }

};

export const deleteRole = async ({ role_id }: { role_id: string }) => {
  try {
    const response = await Axios.patch("/role/delete", {
      role_id,
    });

    return response.data;

  } catch (error) {
    console.error("Error delete role:", error);

    const e = axiosErrorHandler(error, '/role/delete')
    throw e;
  }

};

export const createRole = async (payload: RoleWithPermissions) => {
  try {
    const response = await Axios.post("/role/create", payload);

    return response.data;

  } catch (error) {
    console.error("Error create role:", error);

    const e = axiosErrorHandler(error, '/role/create')
    throw e;
  }

};

export const editPermission = async (payload: EditPermissionsPayload) => {
  try {
    const response = await Axios.post("/role/permission/update", payload);

    return response.data;

  } catch (error) {
    console.error("Error edit permission:", error);

    const e = axiosErrorHandler(error, '/role/permission/update')
    throw e;
  }

};

export const fetchPermission = async () => {
  try {
    const response = await Axios.get("/role/permission/getList");

    return response.data;

  } catch (error) {
    console.error("Error fetch Permission:", error);

    const e = axiosErrorHandler(error, '/role/permission/getList')
    throw e;
  }

};

export const fetchPermissionExist = async (payload: RoleExistPayload) => {
  try {
    const response = await Axios.post("/role/permission/update/getList", payload);

    return response.data;

  } catch (error) {
    console.error("Error fetch Permission exist:", error);

    const e = axiosErrorHandler(error, '/role/permission/update/getList')
    throw e;
  }

};

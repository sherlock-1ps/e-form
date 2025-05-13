import Axios from "@/libs/axios/axios";
import { ResetPasswordOperatorPayload, UpdateOperatorPayload } from "@/types/operator/operatorTypes";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchAccount = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/operator/getList", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching account:", error);

    axiosErrorHandler(error, '/operator/getList')
    throw error;

  }

};

export const searchAccount = async ({ page, pageSize, email }: { page: number; pageSize: number; email: string }) => {
  try {
    const response = await Axios.post("/operator/search", {
      page,
      limit: pageSize,
      email
    });

    return response.data;

  } catch (error) {
    console.error("Error search account:", error);

    axiosErrorHandler(error, '/operator/search')
    throw error;

  }

};

export const createOperator = async ({ role_id, password, email }: { role_id: string; password: string; email: string }) => {
  try {
    const response = await Axios.post("/operator/create", {
      password,
      role_id,
      email
    });

    return response.data;

  } catch (error) {
    console.error("Error create account:", error);

    const e = axiosErrorHandler(error, '/operator/create')
    throw e;

  }

};


export const updateStatusAccount = async ({ operator_user_id, is_enable }: { operator_user_id: string; is_enable: boolean }) => {
  try {
    const response = await Axios.patch("/operator/update/status", {
      operator_user_id,
      is_enable
    });

    return response.data;

  } catch (error) {
    console.error("Error search account:", error);

    axiosErrorHandler(error, '/operator/update/status')
    throw error;

  }

};

export const changeRoleAccount = async ({ role_id, operator_user_id }: { role_id: string; operator_user_id: string }) => {
  try {
    const response = await Axios.patch("/operator/update/role", {
      role_id,
      operator_user_id
    });

    return response.data;

  } catch (error) {
    console.error("Error change role account:", error);

    axiosErrorHandler(error, '/operator/update/role')
    throw error;

  }

};





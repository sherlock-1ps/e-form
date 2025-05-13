import Axios from "@/libs/axios/axios";
import { ResetPasswordOperatorPayload, UpdateOperatorPayload, CreateOperatorPayload } from "@/types/operator/operatorTypes";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchOperator = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/operator/get", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching operator:", error);

    axiosErrorHandler(error, '/operator/get')
    throw error;

  }

};

export const updateOperator = async (payload: UpdateOperatorPayload) => {
  try {
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await Axios.post("/operator/edit", filteredPayload);

    return response.data;
  } catch (error) {
    console.error("Error updating operator:", error);
    axiosErrorHandler(error, "/operator/edit");

    throw error;
  }
};

export const deleteOperator = async (payload: ResetPasswordOperatorPayload) => {
  try {
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await Axios.post("/operator/resetPassword", filteredPayload);

    return response.data;
  } catch (error) {
    console.error("Error reset password operator:", error);
    axiosErrorHandler(error, "/operator/resetPassword");

    throw error;
  }
};

export const createOperator = async (payload: CreateOperatorPayload) => {
  try {
    const response = await Axios.post("/operator/create", payload);

    return response.data;

  } catch (error) {
    console.error("Error create operator:", error);

    axiosErrorHandler(error, '/operator/create')
    throw error;

  }

};

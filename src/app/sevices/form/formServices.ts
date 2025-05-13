import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

type VariableValue = {
  value: any
}

type EditVariablePayload = {
  id: number
  name: string
  variableType: string
  value: VariableValue
}

type CreateVariablePayload = {
  name: string
  variableType: string
  value: VariableValue
}

export const fetchForm = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/forms/getListForm", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetch form:", error);

    axiosErrorHandler(error, '/forms/getListForm')
    throw error;

  }

};

export const getForm = async ({ id }: { id: any }) => {
  try {
    const response = await Axios.post("/forms/getForm", { id });

    return response.data;

  } catch (error) {
    console.error("Error get form:", error);

    const e = axiosErrorHandler(error, '/forms/getForm')
    throw e;

  }

};


export const createForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post("/forms/createNewForm", request);

    return response.data;

  } catch (error) {
    console.error("Error create form:", error);

    const e = axiosErrorHandler(error, '/forms/createNewForm')
    throw e;

  }

};

export const updateForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post("/forms/updateForm", request);

    return response.data;

  } catch (error) {
    console.error("Error update form:", error);

    const e = axiosErrorHandler(error, '/forms/updateForm')
    throw e;

  }

};


export const createNewVersionForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post("/forms/createNewVersion", request);

    return response.data;

  } catch (error) {
    console.error("Error create new version form:", error);

    const e = axiosErrorHandler(error, '/forms/createNewVersion')
    throw e;

  }

};

export const deleteForm = async ({ id }: { id: number }) => {
  try {

    const response = await Axios.post("/forms/deleteForm", { id });

    return response.data;

  } catch (error) {
    console.error("Error delete form:", error);

    const e = axiosErrorHandler(error, '/forms/deleteForm')
    throw e;

  }

};

export const fetchVariable = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/variable/list", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetch variable:", error);

    axiosErrorHandler(error, '/variable/list')
    throw error;

  }

};

export const createVariable = async (payload: CreateVariablePayload) => {
  try {
    const response = await Axios.post("/variable/create", payload);

    return response.data;

  } catch (error) {
    console.error("Error create variable:", error);

    axiosErrorHandler(error, '/variable/create')
    throw error;

  }

};

export const editVariable = async (payload: EditVariablePayload) => {
  try {
    const response = await Axios.post('/variable/edit', payload)

    return response.data
  } catch (error) {
    console.error('Error edit variable:', error)
    axiosErrorHandler(error, '/variable/edit')
    throw error
  }
}

export const deleteVariable = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post("/variable/delete", {
      id,
    });

    return response.data;

  } catch (error) {
    console.error("Error delete variable:", error);

    axiosErrorHandler(error, '/variable/delete')
    throw error;

  }

};




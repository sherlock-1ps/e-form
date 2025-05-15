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

export const fetchMedia = async ({ id }: { id: number | null }) => {
  try {
    const response = await Axios.post("/media/getListMediaFolder", {
      id: id
    });

    return response.data;

  } catch (error) {
    console.error("Error fetch media:", error);

    axiosErrorHandler(error, '/media/getListMediaFolder')
    throw error;

  }

};

export const createFolder = async ({ name, parent_id }: { name: string; parent_id?: number | null }) => {
  try {
    const payload: any = { name }

    if (parent_id != null) {
      payload.parent_id = parent_id
    }

    const response = await Axios.post('/media/createMediaFolder', payload)

    return response.data
  } catch (error) {
    console.error('Error create folder media:', error)
    const e = axiosErrorHandler(error, '/media/createMediaFolder')
    throw e
  }
}

export const changeNameFolder = async ({ name, id }: { name: string; id: number }) => {
  try {
    const payload: any = { name, id }



    const response = await Axios.post('/media/updateMediaFolder', payload)

    return response.data
  } catch (error) {
    console.error('Error change name folder :', error)
    const e = axiosErrorHandler(error, '/media/updateMediaFolder')
    throw e
  }
}

export const deleteFolder = async ({ id }: { id: number }) => {
  try {
    const payload: any = { id }
    const response = await Axios.post('/media/deleteMediaFolder', payload)

    return response.data
  } catch (error) {
    console.error('Error delete folder media:', error)
    const e = axiosErrorHandler(error, '/media/deleteMediaFolder')
    throw e
  }
}

export const uploadMedia = async ({
  file,
  folderId
}: {
  file: File
  folderId: number
}) => {
  try {
    const formData = new FormData()
    formData.append('folder_id', String(folderId))
    formData.append('file', file)

    const response = await Axios.post('/media/uploadMedia', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error upload media:', error)
    const e = axiosErrorHandler(error, '/media/uploadMedia')
    throw e
  }
}


export const changeNameImage = async ({ name, id }: { name: string; id: number }) => {
  try {
    const payload: any = { name, id }

    const response = await Axios.post('/media/updateMedia', payload)

    return response.data
  } catch (error) {
    console.error('Error change name image :', error)
    const e = axiosErrorHandler(error, '/media/updateMedia')
    throw e
  }
}


export const deleteMedia = async ({ id }: { id: number }) => {
  try {
    const payload: any = { id }
    const response = await Axios.post('/media/deleteMedia', payload)

    return response.data
  } catch (error) {
    console.error('Error delete media:', error)
    const e = axiosErrorHandler(error, '/media/deleteMedia')
    throw e
  }
}




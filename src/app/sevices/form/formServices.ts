import Axios from '@/libs/axios/axios'
import AxiosExternal from '@/libs/axios/axiosExternal'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

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
    const response = await Axios.post('/forms/list', {
      page,
      limit: pageSize
    })

    return response.data
  } catch (error) {
    console.error('Error fetch form:', error)

    axiosErrorHandler(error, '/forms/list')
    throw error
  }
}

export const getForm = async ({ id }: { id: any }) => {
  try {
    const response = await Axios.post('/forms/get', { id })

    return response.data
  } catch (error) {
    console.error('Error get form:', error)

    const e = axiosErrorHandler(error, '/forms/get')
    throw e
  }
}

export const updateDateForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/forms/public/update', request)

    return response.data
  } catch (error) {
    console.error('Error update date form:', error)

    const e = axiosErrorHandler(error, '/forms/public/update')
    throw e
  }
}

export const createForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/forms/create', request)

    return response.data
  } catch (error) {
    console.error('Error create form:', error)

    const e = axiosErrorHandler(error, '/forms/create')
    throw e
  }
}

export const updateForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/forms/update', request)

    return response.data
  } catch (error) {
    console.error('Error update form:', error)

    const e = axiosErrorHandler(error, '/forms/update')
    throw e
  }
}

export const createNewVersionForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/forms/versions/create', request)

    return response.data
  } catch (error) {
    console.error('Error create new version form:', error)

    const e = axiosErrorHandler(error, '/forms/versions/create')
    throw e
  }
}

export const deleteForm = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post('/forms/delete', { id })

    return response.data
  } catch (error) {
    console.error('Error delete form:', error)

    const e = axiosErrorHandler(error, '/forms/delete')
    throw e
  }
}

export const fetchVariable = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post('/variable/list', {
      page,
      limit: pageSize
    })

    return response.data
  } catch (error) {
    console.error('Error fetch variable:', error)

    axiosErrorHandler(error, '/variable/list')
    throw error
  }
}

export const createVariable = async (payload: CreateVariablePayload) => {
  try {
    const response = await Axios.post('/variable/create', payload)

    return response.data
  } catch (error) {
    console.error('Error create variable:', error)

    axiosErrorHandler(error, '/variable/create')
    throw error
  }
}

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
    const response = await Axios.post('/variable/delete', {
      id
    })

    return response.data
  } catch (error) {
    console.error('Error delete variable:', error)

    axiosErrorHandler(error, '/variable/delete')
    throw error
  }
}

export const fetchMedia = async ({ id }: { id: number | null }) => {
  try {
    const response = await Axios.post('/media/folders/list', {
      id: id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch media:', error)

    axiosErrorHandler(error, '/media/folders/list')
    throw error
  }
}

export const createFolder = async ({ name, parent_id }: { name: string; parent_id?: number | null }) => {
  try {
    const payload: any = { name }

    if (parent_id != null) {
      payload.parent_id = parent_id
    }

    const response = await Axios.post('/media/folders/create', payload)

    return response.data
  } catch (error) {
    console.error('Error create folder media:', error)
    const e = axiosErrorHandler(error, '/media/folders/create')
    throw e
  }
}

export const changeNameFolder = async ({ name, id }: { name: string; id: number }) => {
  try {
    const payload: any = { name, id }

    const response = await Axios.post('/media/folders/update', payload)

    return response.data
  } catch (error) {
    console.error('Error change name folder :', error)
    const e = axiosErrorHandler(error, '/media/folders/update')
    throw e
  }
}

export const deleteFolder = async ({ id }: { id: number }) => {
  try {
    const payload: any = { id }
    const response = await Axios.post('/media/folders/delete', payload)

    return response.data
  } catch (error) {
    console.error('Error delete folder media:', error)
    const e = axiosErrorHandler(error, '/media/folders/delete')
    throw e
  }
}

export const uploadMedia = async ({ file, folderId }: { file: File; folderId: number }) => {
  try {
    const formData = new FormData()
    formData.append('folder_id', String(folderId))
    formData.append('file', file)

    const response = await Axios.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error upload media:', error)
    const e = axiosErrorHandler(error, '/media/upload')
    throw e
  }
}

export const changeNameImage = async ({ name, id }: { name: string; id: number }) => {
  try {
    const payload: any = { name, id }

    const response = await Axios.post('/media/update', payload)

    return response.data
  } catch (error) {
    console.error('Error change name image :', error)
    const e = axiosErrorHandler(error, '/media/update')
    throw e
  }
}

export const deleteMedia = async ({ id }: { id: number }) => {
  try {
    const payload: any = { id }
    const response = await Axios.post('/media/delete', payload)

    return response.data
  } catch (error) {
    console.error('Error delete media:', error)
    const e = axiosErrorHandler(error, '/media/delete')
    throw e
  }
}

export const fetchApi = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post('/apis/list', {
      page,
      limit: pageSize,
      order_by: 'id DESC'
    })

    return response.data
  } catch (error) {
    console.error('Error fetch api:', error)

    const e = axiosErrorHandler(error, '/apis/list')
    throw e
  }
}

export const createApi = async ({
  name,
  method,
  url,
  body,
  headers
}: {
  name: string
  method: string
  url: string
  body: any
  headers: any
}) => {
  try {
    const payload: any = { name, method, url }

    if (body != null) {
      payload.body = body
    }

    if (headers != null) {
      payload.headers = headers
    }

    const response = await Axios.post('/apis/create', payload)

    return response.data
  } catch (error) {
    console.error('Error create api:', error)
    const e = axiosErrorHandler(error, '/apis/create')
    throw e
  }
}

export const updateApi = async ({
  id,
  name,
  method,
  url,
  body,
  headers
}: {
  id: number
  name: string
  method: string
  url: string
  body: any
  headers: any
}) => {
  try {
    const payload: any = { id, name, method, url }

    if (body != null) {
      payload.body = body
    }

    if (headers != null) {
      payload.headers = headers
    }

    const response = await Axios.post('/apis/update', payload)

    return response.data
  } catch (error) {
    console.error('Error update api:', error)
    const e = axiosErrorHandler(error, '/apis/update')
    throw e
  }
}

export const deleteApi = async ({ id }: { id: number }) => {
  try {
    const payload: any = { id }
    const response = await Axios.post('/apis/delete', payload)

    return response.data
  } catch (error) {
    console.error('Error delete api:', error)
    const e = axiosErrorHandler(error, '/apis/delete')
    throw e
  }
}

export const getUploadFile = async ({ form_data_id }: { form_data_id: number }) => {
  try {
    const response = await Axios.post('/uploads/list', {
      form_data_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch upload file:', error)

    const e = axiosErrorHandler(error, '/uploads/list')
    throw e
  }
}

export const uploadFile = async ({ file, form_data_id }: { file: File; form_data_id: number }) => {
  try {
    const formData = new FormData()
    formData.append('form_data_id', String(form_data_id))
    formData.append('file', file)

    const response = await Axios.post('/uploads/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error upload file:', error)
    const e = axiosErrorHandler(error, '/uploads/create')
    throw e
  }
}

export const updateFile = async ({ id, comment }: { id: number; comment: string }) => {
  try {
    const payload: any = { id, comment }
    const response = await Axios.post('/uploads/update', payload)

    return response.data
  } catch (error) {
    console.error('Error update file:', error)
    const e = axiosErrorHandler(error, '/uploads/update')
    throw e
  }
}

export const deleteUploadFile = async ({ id }: { id: number }) => {
  try {
    const payload: any = { id }
    const response = await Axios.post('/uploads/delete', payload)

    return response.data
  } catch (error) {
    console.error('Error delete file:', error)
    const e = axiosErrorHandler(error, '/uploads/delete')
    throw e
  }
}

export const fetchFlowName = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post('/flows/get-name', {
      page,
      limit: pageSize
    })

    return response.data
  } catch (error) {
    console.error('Error fetch flow name:', error)

    axiosErrorHandler(error, '/flows/get-name')
    throw error
  }
}

export const getStartFlow = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post('/flows/get-start-flow', {
      id: id
    })

    return response.data
  } catch (error) {
    console.error('Error get start flow:', error)

    const e = axiosErrorHandler(error, '/flows/get-start-flow')
    throw e
  }
}

export const getNextFlow = async ({ form_data_id }: { form_data_id: number }) => {
  try {
    const response = await Axios.post('/flows/get-next-flow', {
      form_data_id: form_data_id
    })

    return response.data
  } catch (error) {
    console.error('Error get next flow:', error)

    const e = axiosErrorHandler(error, '/flows/get-next-flow')
    throw e
  }
}

export const fetchFlow = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post('/flows/list', {
      page,
      limit: pageSize
    })

    return response.data
  } catch (error) {
    console.error('Error fetch flow:', error)

    axiosErrorHandler(error, '/flows/list')
    throw error
  }
}

export const deleteFlow = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post('/flows/delete', { id })

    return response.data
  } catch (error) {
    console.error('Error delete flow:', error)

    const e = axiosErrorHandler(error, '/flows/delete')
    throw e
  }
}

export const updateDateFlow = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/flows/public/update', request)

    return response.data
  } catch (error) {
    console.error('Error update date flow:', error)

    const e = axiosErrorHandler(error, '/flows/public/update')
    throw e
  }
}

export const createFlow = async (request: any) => {
  try {
    const response = await Axios.post('/flows/create', request)
    return response.data
  } catch (error) {
    console.error('Error create flow:', error)
    const e = axiosErrorHandler(error, '/flows/create')
    throw e
  }
}

export const updateFlow = async (request: any) => {
  try {
    const response = await Axios.post('/flows/update', request)
    return response.data
  } catch (error) {
    console.error('Error update flow:', error)
    const e = axiosErrorHandler(error, '/flows/update')
    throw e
  }
}

export const updateVersion = async (request: any) => {
  try {
    const response = await Axios.post('/flows/versions/create', request)
    return response.data
  } catch (error) {
    console.error('Error update version:', error)
    const e = axiosErrorHandler(error, '/flows/versions/create')
    throw e
  }
}

export const getFlow = async (id: number) => {
  try {
    const response = await Axios.post('/flows/get', { id })
    return response.data
  } catch (error) {
    console.error('Error get flow:', error)
    const e = axiosErrorHandler(error, '/flows/get')
    throw e
  }
}

export const getPersonList = async ({
  page,
  pageSize,
  f_person_id = '',
  f_name = ''
}: {
  page: number
  pageSize: number
  f_person_id?: string
  f_name?: string
}) => {
  try {
    const payload = { page, limit: pageSize, f_person_id, f_name }
    const response = await AxiosExternal.post('/api/service/core/get-person-lists', payload)
    return response.data
  } catch (error) {
    console.error('Error get person list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-person-lists')
    throw e
  }
}

export const getPositionList = async ({
  page,
  pageSize,
  f_position_id = '',
  f_position_name = ''
}: {
  page: number
  pageSize: number
  f_position_id?: string
  f_position_name?: string
}) => {
  try {
    const payload = { page, limit: pageSize, f_position_id, f_position_name }
    const response = await AxiosExternal.post('/api/service/core/get-position-lists', payload)
    return response.data
  } catch (error) {
    console.error('Error get position list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-position-lists')
    throw e
  }
}

export const getDepartmentList = async ({
  page,
  pageSize,
  f_dept_id = '',
  department_name = ''
}: {
  page: number
  pageSize: number
  f_dept_id?: string
  department_name?: string
}) => {
  try {
    const payload = { page, limit: pageSize, f_dept_id, department_name }
    const response = await AxiosExternal.post('/api/service/core/get-department-lists', payload)
    return response.data
  } catch (error) {
    console.error('Error get department list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-department-lists')
    throw e
  }
}

export const fetchFormName = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post('/forms/get-name', {
      page,
      limit: pageSize
    })

    return response.data
  } catch (error) {
    console.error('Error fetch form:', error)

    axiosErrorHandler(error, '/forms/get-name')
    throw error
  }
}

export const fetchAttachments = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post('/attachments/list', {
      form_data_id: id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch attachments:', error)

    const e = axiosErrorHandler(error, '/attachments/list')
    throw e
  }
}

export const uploadAttachments = async ({ file, form_data_id }: { file: File; form_data_id: number }) => {
  try {
    const formData = new FormData()
    formData.append('form_data_id', String(form_data_id))
    formData.append('file', file)

    const response = await Axios.post('/attachments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error upload attachments:', error)
    const e = axiosErrorHandler(error, '/attachments/upload')
    throw e
  }
}

export const deleteAttachments = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post('/attachments/delete', {
      id: id
    })

    return response.data
  } catch (error) {
    console.error('Error delete attachments:', error)

    const e = axiosErrorHandler(error, '/attachments/delete')
    throw e
  }
}

export const fetchListComment = async ({
  page,
  pageSize,
  form_data_id
}: {
  page: number
  pageSize: number
  form_data_id: number
}) => {
  try {
    const response = await Axios.post('/form-datas/list/comment', {
      page,
      limit: pageSize,
      form_data_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch list comment:', error)

    axiosErrorHandler(error, '/form-datas/list/comment')
    throw error
  }
}

export const saveStartFlow = async (request: any) => {
  try {
    const response = await Axios.post('/form-datas/save', request)
    return response.data
  } catch (error) {
    console.error('Error save start flow:', error)
    const e = axiosErrorHandler(error, '/form-datas/save')
    throw e
  }
}

export const fetchWorkInProgress = async ({
  page,
  pageSize,
  flow_id
}: {
  page: number
  pageSize: number
  flow_id: number
}) => {
  try {
    const response = await Axios.post('/form-datas/work/in-progress', {
      page,
      limit: pageSize,
      flow_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch work in progress:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/in-progress')
    throw e
  }
}

export const fetchWorkAll = async ({
  page,
  pageSize,
  flow_id
}: {
  page: number
  pageSize: number
  flow_id: number
}) => {
  try {
    const response = await Axios.post('/form-datas/work/all', {
      page,
      limit: pageSize,
      flow_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch work all:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/all')
    throw e
  }
}

export const fetchWorkMy = async ({ page, pageSize, flow_id }: { page: number; pageSize: number; flow_id: number }) => {
  try {
    const response = await Axios.post('/form-datas/work/my', {
      page,
      limit: pageSize,
      flow_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch work my:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/my')
    throw e
  }
}

export const viewFlow = async (request: any) => {
  try {
    const response = await Axios.post('/form-datas/view-flow', request)
    return response.data
  } catch (error) {
    console.error('Error create flow:', error)
    const e = axiosErrorHandler(error, '/form-datas/view-flow')
    throw e
  }
}

export const fetchNotification = async ({ page, pageSize }: { page: number; pageSize: number; }) => {
  try {
    const response = await Axios.post('/notifications/list', {
      page,
      limit: pageSize,
      order_by: "status ASC, created_at DESC"
    })

    return response.data
  } catch (error) {
    console.error('Error fetch notification:', error)

    const e = axiosErrorHandler(error, '/notifications/list')
    throw e
  }
}

export const readNotificationRead = async ({ id }: { id: number; }) => {
  try {
    const response = await Axios.post('/notifications/read', {
      id,
    })

    return response.data
  } catch (error) {
    console.error('Error read notification:', error)

    const e = axiosErrorHandler(error, '/notifications/read')
    throw e
  }
}

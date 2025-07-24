import Axios from '@/libs/axios/axios'
import AxiosExternal from '@/libs/axios/axiosExternal'
import { useAuthStore } from '@/store/useAuthStore'
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

const getAuthFromStorage = () => {
  const storedData = localStorage.getItem('auth-storage')
  if (!storedData) {
    return null
  }
  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.error("Error parsing 'auth-storage' from localStorage:", error)
    return null
  }
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

export const updateSignatrueForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/form-datas/signature/update', request)

    return response.data
  } catch (error) {
    console.error('Error update signatrue form:', error)

    const e = axiosErrorHandler(error, '/form-datas/signature/update')
    throw e
  }
}

export const replaceSignatrueForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/form-datas/signature/replace', request)

    return response.data
  } catch (error) {
    console.error('Error replace signatrue form:', error)

    const e = axiosErrorHandler(error, '/form-datas/signature/replace')
    throw e
  }
}

export const selectSignatrueForm = async ({ request }: { request: any }) => {
  try {
    const response = await Axios.post('/form-datas/signature/select', request)

    return response.data
  } catch (error) {
    console.error('Error replace signatrue form:', error)

    const e = axiosErrorHandler(error, '/form-datas/signature/select')
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

export const deleteFormData = async ({ form_data_id }: { form_data_id: number }) => {
  try {
    const response = await Axios.post('/form-datas/work/delete', { form_data_id })

    return response.data
  } catch (error) {
    console.error('Error delete form:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/delete')
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

export const getNextFlow = async ({ form_data_id }: { form_data_id: any }) => {
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
  text = ''
}: {
  page: number
  pageSize: number
  text?: string
}) => {
  try {
    const payload: Record<string, any> = { page, limit: pageSize }

    if (text.trim() !== '') {
      if (/^\d+$/.test(text)) {
        payload.f_person_id = Number(text)
      } else {
        payload.f_name = text
      }
    }

    const response = await AxiosExternal.post('/api/service/core/get-person-lists', payload)

    const data = response?.data?.items?.data.map((i: any) => ({
      pk: `${i.F_PERSON_ID}-1`,
      typeId: '1',
      id: i.F_PERSON_ID,
      name: `${i.F_FIRST_NAME} ${i.F_LAST_NAME}`.trim(),
      type: 'บุคคล',
      departmentName: `${i.DEPARTMENT_NAME}`.trim(),
      personName: `${i.F_POSITION_NAME}`.trim()
    }))
    return { data, total: response?.data?.items.total }
  } catch (error) {
    console.error('Error get person list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-person-lists')
    throw e
  }
}

export const getCertificates = async () => {
  try {
    const auth = getAuthFromStorage()
    const response = await AxiosExternal.post('/api/service/core/get-certificate-info', {
      f_person_id: auth?.state?.profile?.F_PERSON_ID || ''
    })
    const data = response?.data?.items
    return { data }
  } catch (error) {
    console.error('Error get Certificate list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-certificate-info')
    throw e
  }
}

export const verifyCertificate = async ({ password = '' }: { password: string }) => {
  try {
    const auth = getAuthFromStorage()
    const response = await AxiosExternal.post('/api/service/core/verify-pass-certificate', {
      f_person_id: auth?.state?.profile?.F_PERSON_ID || '',
      password
    })
    const data = response?.data

    return { data }
  } catch (error) {
    console.error('Error verify Certificate list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/verify-pass-certificate')
    throw e
  }
}

export const verifyFortitoken = async ({ password = '' }: { password: string }) => {
  try {
    const auth = getAuthFromStorage()
    const response = await AxiosExternal.post('/api/service/core/verify-fortitoken', {
      f_person_id: auth?.state?.profile?.F_PERSON_ID || '',
      fortitoken: password
    })
    const data = response?.data

    return { data }
  } catch (error) {
    console.error('Error verify Fortitoken list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/verify-fortitoken')
    throw e
  }
}

export const getPositionList = async ({
  page,
  pageSize,
  text = ''
}: {
  page: number
  pageSize: number
  text?: string
}) => {
  try {
    const payload: Record<string, any> = { page, limit: pageSize }

    if (text.trim() !== '') {
      if (/^\d+$/.test(text)) {
        payload.f_position_id = Number(text)
      } else {
        payload.f_position_name = text
      }
    }

    const response = await AxiosExternal.post('/api/service/core/get-position-lists', payload)

    const data = response?.data?.items?.data.map((i: any) => ({
      pk: `${i.F_POSITION_ID}-2`,
      typeId: '2',
      id: i.F_POSITION_ID,
      name: `${i.F_POSITION_NAME}`.trim(),
      type: 'ตำแหน่ง'
    }))
    return { data, total: response?.data?.items.total }
  } catch (error) {
    console.error('Error get position list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-position-lists')
    throw e
  }
}

export const getDepartmentList = async ({
  page,
  pageSize,
  text = ''
}: {
  page: number
  pageSize: number
  text?: string
}) => {
  try {
    const payload: Record<string, any> = { page, limit: pageSize }

    if (text.trim() !== '') {
      if (/^\d+$/.test(text)) {
        payload.f_dept_id = Number(text)
      } else {
        payload.department_name = text
      }
    }

    const response = await AxiosExternal.post('/api/service/core/get-department-lists', payload)
    const data = response?.data?.items?.data.map((i: any) => ({
      pk: `${i.F_DEPT_ID}-3`,
      typeId: '3',
      id: i.F_DEPT_ID,
      name: `${i.DEPARTMENT_NAME}`.trim(),
      type: 'หน่วยงาน'
    }))
    return { data, total: response?.data?.items.total }
  } catch (error) {
    console.error('Error get department list:', error)
    const e = axiosErrorHandler(error, '/api/service/core/get-department-lists')
    throw e
  }
}

export const logout = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken

    const response = await AxiosExternal.post(
      '/api/service/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error logout:', error)
    const e = axiosErrorHandler(error, 'api/service/logout')
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

export const getActingList = async () => {
  try {
    const response = await Axios.post('/auth/acting/list', {})
    const data = response?.data?.result?.data || []

    return { data, total: data.length }
  } catch (error) {
    console.error('Error get ฟcting list:', error)
    const e = axiosErrorHandler(error, '/auth/acting/list')
    throw e
  }
}

export const saveActing = async (request: any) => {
  try {
    const response = await Axios.post('/auth/acting/save', request)
    return response.data
  } catch (error) {
    console.error('Error save acting flow:', error)
    const e = axiosErrorHandler(error, '/auth/acting/save')
    throw e
  }
}

export const deleteActing = async (request: any) => {
  try {
    const response = await Axios.post('/auth/acting/delete', request)
    return response.data
  } catch (error) {
    console.error('Error del acting flow:', error)
    const e = axiosErrorHandler(error, '/auth/acting/delete')
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

export const fetchWorkOwner = async ({
  page,
  pageSize,
  flow_id
}: {
  page: number
  pageSize: number
  flow_id: number
}) => {
  try {
    const response = await Axios.post('/form-datas/work/owner', {
      page,
      limit: pageSize,
      flow_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch work owner:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/owner')
    throw e
  }
}

export const fetchWorkEnd = async ({
  page,
  pageSize,
  flow_id
}: {
  page: number
  pageSize: number
  flow_id: number
}) => {
  try {
    const response = await Axios.post('/form-datas/work/end', {
      page,
      limit: pageSize,
      flow_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch work end:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/end')
    throw e
  }
}

export const fetchWorkAllSysDoc = async ({
  page,
  pageSize,
  flow_id
}: {
  page: number
  pageSize: number
  flow_id: number
}) => {
  try {
    const response = await Axios.post('/form-datas/work/all-sys-doc', {
      page,
      limit: pageSize,
      flow_id
    })

    return response.data
  } catch (error) {
    console.error('Error fetch work all-sys-doc:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/all-sys-doc')
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

export const fetchNotification = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post('/notifications/list', {
      page,
      limit: pageSize,
      order_by: 'status ASC, created_at DESC'
    })

    return response.data
  } catch (error) {
    console.error('Error fetch notification:', error)

    const e = axiosErrorHandler(error, '/notifications/list')
    throw e
  }
}

export const readNotificationRead = async ({ id }: { id: number }) => {
  try {
    const response = await Axios.post('/notifications/read', {
      id
    })

    return response.data
  } catch (error) {
    console.error('Error read notification:', error)

    const e = axiosErrorHandler(error, '/notifications/read')
    throw e
  }
}

export const reportScore = async ({
  form_version_id,
  start_date,
  end_date
}: {
  form_version_id: number
  start_date: string
  end_date: string
}) => {
  try {
    const response = await Axios.post('/form-datas/report/score', {
      form_version_id,
      start_date,
      end_date
    })

    return response.data
  } catch (error) {
    console.error('Error report score:', error)

    const e = axiosErrorHandler(error, '/form-datas/report/score')
    throw e
  }
}

export const reportMedical = async ({
  form_version_id,
  start_date,
  end_date
}: {
  form_version_id: number
  start_date: string
  end_date: string
}) => {
  try {
    const response = await Axios.post('/form-datas/report/medical', {
      form_version_id,
      start_date,
      end_date
    })

    return response.data
  } catch (error) {
    console.error('Error report medical:', error)

    const e = axiosErrorHandler(error, '/form-datas/report/medical')
    throw e
  }
}

export const getFormSignatureFields = async (id: number) => {
  try {
    if (id != 0 && id != null) {
      const response = await Axios.post('/forms/get-fields', {
        id,
        type: ['signature']
      })
      return response.data
    }
  } catch (error) {
    console.error('Error read getFormSignatureFields:', error)

    const e = axiosErrorHandler(error, '/forms/get-fields')
    throw e
  }
}

export const getFormSignaturePermisionFields = async (id: number) => {
  try {
    // console.log('id: ', id)
    let allItems = [{ pk: '1-4', id: 1, name: 'เจ้าของเรื่อง', type: 'ฟิวด์', typeId: '4' }]
    if (id != 0 && id != null) {
      const response = await Axios.post('/forms/get-fields', {
        id,
        type: ['signature']
      })

      console.log('response', response)

      const dataResponse =
        response?.data?.result?.data?.map((i: any, index: number) => ({
          pk: `${i.id}`,
          typeId: '4',
          // id: i.id,
          id: (index + 2) * -1,
          name: `${i.id}`.trim(),
          type: 'ลายเซ็น'
        })) || []
      allItems = [...allItems, ...dataResponse]
      // console.log('dataResponse', dataResponse)
    }
    return { data: allItems, total: allItems.length }
  } catch (error) {
    console.error('Error read getFormSignatureFields:', error)

    const e = axiosErrorHandler(error, '/forms/get-fields')
    throw e
  }
}

export const getFormFields = async (id: number) => {
  try {
    if (id != 0 && id != null) {
      const response = await Axios.post('/forms/get-fields', {
        id,
        type: ['textfield', 'checkbox', 'redio', 'dropdown', 'switch']
      })
      return response.data
    }
  } catch (error) {
    console.error('Error read getFormSignatureFields:', error)

    const e = axiosErrorHandler(error, '/forms/get-fields')
    throw e
  }
}

export const fetchWorkCount = async () => {
  try {
    const response = await Axios.post('/form-datas/work/count')

    return response.data
  } catch (error) {
    console.error('Error get work count:', error)

    const e = axiosErrorHandler(error, '/form-datas/work/count')
    throw e
  }
}

'use server'

import { revalidatePath } from 'next/cache'

import Axios from '@/libs/axios/axios'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'
import type {
  ChangePasswordAssistantType,
  CreateAssistantType,
  DeleteAssistantType,
  UpdateAssistantType
} from '@/types/pages/assistant/assistantTypes'

/**
 * ! Get assistant list from server
 */


export const getAssistantData = async () => {
  try {
    const response = await Axios.get('/user/getUser')

    return response.data // Ensure API response is returned when successful
  } catch (error) {
    // console.error("Error fetching assistant data:", error)
    // axiosErrorHandler(error, '/user/getUser')

    // จำลองงงงงงงงงงงง
    return {
      data: {
        list: [
          {
            id: 1,
            username: "admin",
            phone_number: "191",
            description: "",
            profile_image: "",
            is_active: true,
            is_owner: true,
            roles: [],
            permissions: []
          }
        ]
      }
    }
  }
}


/**
 * ! create assistant list from server
 */

export const createAssistantData = async (formData: CreateAssistantType) => {
  try {
    const request = formData

    request.is_active = true
    request.is_owner = false

    const response = await Axios.post('/user/createUser', request)

    revalidatePath('/bops/assistant')

    return response.data
  } catch (error) {
    axiosErrorHandler(error, '/user/createUser')
  }
}

/**
 * ! edit assistant list from server
 */

export const editAssistantData = async (formData: UpdateAssistantType) => {
  try {
    const request = formData

    console.log('request', request)

    const response = await Axios.post('/user/updateUser', request)

    revalidatePath('/bops/assistant')

    return response.data
  } catch (error) {
    axiosErrorHandler(error, '/user/updateUser')
  }
}

/**
 * ! delete assistant list from server
 */

export const deleteAssistantData = async (id: DeleteAssistantType) => {
  try {
    const request = id

    const response = await Axios.post('/user/deleteUser', request)

    revalidatePath('/bops/assistant')

    return response.data
  } catch (error) {
    axiosErrorHandler(error, '/user/deleteUser')
  }
}

/**
 * ! change password assistant list from server
 */

export const changePasswordAssistant = async (formData: ChangePasswordAssistantType) => {
  try {
    const request = formData

    const response = await Axios.post('/user/changePassword', request)

    revalidatePath('/bops/assistant')

    return response.data
  } catch (error) {
    axiosErrorHandler(error, '/user/changePassword')
  }
}

'use server'
import { revalidatePath } from 'next/cache'

import Axios from '@/libs/axios/axios'
import type {
  CreateRoleType,
  DeleteRoleType,
  GetRoleUserManagementType,
  UpdateRoleType,
  UpdateUserToRole
} from '@/types/pages/role/roleTypes'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

/**
 * ! Get role list from server
 */


export const getRoleData = async () => {
  try {
    const response = await Axios.get('/role/getRole')

    return response.data // Ensure API response is returned if successful
  } catch (error) {
    // console.error("Error fetching role data:", error)
    // axiosErrorHandler(error, '/role/getRole')

    // จำลองงงงง
    return {
      data: {
        list: [
          {
            id: 1,
            name: "Administrator",
            description: "",
            icon: "",
            users: [],
            permissions: [
              {
                id: 1,
                name: "Setting Section",
                actions: [
                  { id: 1, action_id: 1, name: "Can view setting website", group: "Setting Website", preview_image: "" },
                  { id: 2, action_id: 2, name: "Can view setting affiliate", group: "Setting Affiliate", preview_image: "" },
                  { id: 3, action_id: 3, name: "Can edit setting affiliate general", group: "Setting Affiliate", preview_image: "" },
                  { id: 4, action_id: 4, name: "Can edit setting affiliate provider", group: "Setting Affiliate", preview_image: "" },
                  { id: 5, action_id: 5, name: "Can view setting Cashback", group: "Setting Cashback", preview_image: "" },
                  { id: 6, action_id: 6, name: "Can edit setting Cashback general", group: "Setting Cashback", preview_image: "" },
                  { id: 7, action_id: 7, name: "Can edit setting Cashback provider", group: "Setting Cashback", preview_image: "" }
                ]
              }
            ]
          },
          {
            id: 2,
            name: "Staff",
            description: "",
            icon: "",
            users: [],
            permissions: [
              {
                id: 2,
                name: "Role & Permission Section",
                actions: [
                  { id: 18, action_id: 18, name: "Can view role list", group: "Role List", preview_image: "" },
                  { id: 19, action_id: 19, name: "Can create new role", group: "Role List", preview_image: "" },
                  { id: 20, action_id: 20, name: "Can edit role info", group: "Role List", preview_image: "" },
                  { id: 21, action_id: 21, name: "Can delete role", group: "Role List", preview_image: "" },
                  { id: 22, action_id: 22, name: "Can view permission of role", group: "Role List", preview_image: "" },
                  { id: 23, action_id: 23, name: "Can manage assistant in role", group: "Role List", preview_image: "" },
                  { id: 24, action_id: 24, name: "Can view permission of role", group: "Role List", preview_image: "" },
                  { id: 25, action_id: 25, name: "Can set permission of role", group: "Role List", preview_image: "" },
                  { id: 26, action_id: 26, name: "Can view assistant list", group: "Assistant List", preview_image: "" },
                  { id: 27, action_id: 27, name: "Can create new assistant", group: "Assistant List", preview_image: "" },
                  { id: 28, action_id: 28, name: "Can edit assistant info", group: "Assistant List", preview_image: "" },
                  { id: 29, action_id: 29, name: "Can delete assistant", group: "Assistant List", preview_image: "" },
                  { id: 30, action_id: 30, name: "Can change password assistant", group: "Assistant List", preview_image: "" },
                  { id: 31, action_id: 31, name: "Can view assistant log", group: "Assistant List", preview_image: "" }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}

/**
 * ! create role from server
 */

export const createRole = async (formData: CreateRoleType) => {
  try {
    const request = {
      name: formData.name,
      description: formData.description,
      icon: String(formData.icon)
    }

    await Axios.post('/role/createRole', request)

    revalidatePath('/bops/role')
  } catch (error) {
    axiosErrorHandler(error, '/role/createRole')
  }
}

/**
 * ! edit role from server
 */

export const updateRole = async (formData: UpdateRoleType) => {
  try {
    const request = {
      name: formData.name,
      description: formData.description,
      icon: String(formData.icon),
      role_id: formData.role_id
    }

    await Axios.post('/role/updateRole', request)

    revalidatePath('/bops/role')
  } catch (error) {
    axiosErrorHandler(error, '/role/updateRole')
  }
}

/**
 * ! delete role from server
 */

export const deleteRole = async (id: DeleteRoleType) => {
  try {
    const request = {
      role_id: id
    }

    await Axios.post('/role/deleteRole', request)

    revalidatePath('/bops/role')
  } catch (error) {
    axiosErrorHandler(error, '/role/deleteRole')
  }
}

/**
 * ! get User in  role / user out of role from server
 */

export const getRoleUserManagement = async ({ role_id }: GetRoleUserManagementType) => {
  try {
    const request = {
      role_id
    }

    const response = await Axios.post('/role/getRoleUsers', request)

    return response.data
  } catch (error) {
    axiosErrorHandler(error, '/role/getRoleUsers')
  }
}

/**
 * ! create/delete role from server
 */

export const updateUserToRole = async (formdata: UpdateUserToRole) => {
  try {
    const request = formdata

    console.log('request', request)

    await Axios.post('/role/updateRoleUsers', request)

    // revalidatePath('/bops/role')
  } catch (error) {
    axiosErrorHandler(error, '/role/updateRoleUsers')
  }
}

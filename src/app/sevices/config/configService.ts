import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchProvider = async () => {
  try {
    const response = await Axios.get("/config/credential/provider");

    return response.data;

  } catch (error) {
    console.error("Error fetch provider config:", error);

    axiosErrorHandler(error, '/config/credential/provider')
    throw error;

  }

};

export const fetchConfigRole = async () => {
  try {
    const response = await Axios.get("/config/role");

    return response.data;

  } catch (error) {
    console.error("Error fetch config role:", error);

    axiosErrorHandler(error, '/config/role')
    throw error;

  }

};

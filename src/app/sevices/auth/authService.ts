import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const checkJwt = async ({ token }: { token: string }) => {
  try {

    const response = await Axios.post('/auth/verify-ext', {
      token: token,
    })

    if (response?.data?.code !== "SUCCESS") {
      throw new Error("Invalid JWT token")
    }

    return response?.data


  } catch (error) {
    console.error("Error auth jwt:", error);

    const e = axiosErrorHandler(error, '/config/')
    throw e;

  }

};


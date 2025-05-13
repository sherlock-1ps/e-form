import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const checkJwt = async ({ token }: { token: string }) => {
  try {
    // const response = await Axios.post("/config/credential/provider");
    const validToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsInJvbGUiOiJhZG1pbiJ9.l28a2rfWgMw3a_A7PmrJs5Jl7getf85KUzpy22jDSww"

    if (token !== validToken) {
      console.warn("Invalid token:", token)
      throw new Error("Invalid JWT token")
    }

    return {
      "code": "SUCCESS",
      "result": {
        "total": 0,
        "data": {
          "accessToken": token,
          "refreshToken": "8cd80f89-1852-418d-bc48-2d465765db3e"
        },
        "error": "",
        "code": ""
      }
    }


  } catch (error) {
    console.error("Error auth jwt:", error);

    const e = axiosErrorHandler(error, '/config/')
    throw e;

  }

};


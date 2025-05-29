import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const checkJwt = async ({ token }: { token: string }) => {
  try {
    // const response = await Axios.post("/config/credential/provider");
    const validToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5IiwianRpIjoiY2U5ZWE2OGNhMTIzN2Y3NTJiNWY0YTNjNTA1MTM0ZGVjYmE4ODcxZDQ3ODU4NDY3NjJmYmQ1ODdkNzRhZmYwMGQzNDE5ZDE4MDM3OTRlMjgiLCJpYXQiOjE3NDgyNjY3NDEuNTUwOTA2LCJuYmYiOjE3NDgyNjY3NDEuNTUwOTA5LCJleHAiOjE3Nzk4MDI3NDEuNTIwNDM5LCJzdWIiOiI1MTUyMiIsInNjb3BlcyI6W119.A8ognYNKf8dGtolbQhR2LWrPP46BynUhofK-7vG0Xr523YHqNN7K0xgo9EJnp8-aEKyxh731FDINQ2kSBItUrPPJDPaFJ-v61kDpJBCo_Srdv2SZlytqEGjEsEfn2TpDrwhjpx36245B3Dhii7glNV0ZavTdj2IEChRWwt7xUqQFsZq9MPol0u0Sw6KKtSnDiyMxLUvdBM8f0cfKfevJkLGSrhyZLru4ECsn59U42OL5IBvKHolw3TDJDjgWnquEPUIq7Rf8JkjrnLM-598JGGNOmZBO5Yw7u8itgjCLZTnIojXz4lt4RJ0m8PuTEEJ6IVfJOPqV4raiNoY6kPsMtiLrZ-8Wzl1wKUvwmkO1lAxwGuuCh-WpmmmPkc2sJBAwcG1j2rwJ1XmlIxig-fA8vHk9q2uF-iFwjaS3NzC1zUiBx46sWkjsn6rmBeu0wOqbrn0Xwz4aqe0fhDOwFRYhoCEKb2a-pDqD9YIvPoNXy6GQ6XwyKohIb4_7YtfuRq4yVIPjLm_bGFracRPyQy7RF2lVHDDuc-RMrsK3aZPa30iIaRhm3-oB2nULFnWw3ALBXNMmox0JaV1N9ota6WcCLEE9oS_x-4ohpqPjD0tIcMs73cZg4_gQVGmqm50jaNdPGsJBgVr1r687t_ozKY0_-3Xqqjd5mGrEixSL33IW-oc"

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


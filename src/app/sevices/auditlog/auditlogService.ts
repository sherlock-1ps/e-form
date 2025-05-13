import Axios from "@/libs/axios/axios";
import { AuditLogFilterPayload } from "@/types/auditlog/auditlogTypes";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const searchLoginLog = async ({ email, page, pageSize }: { email: string, page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/log/search", {
      action: ["LOGIN"],
      email,
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error search login log:", error);

    const e = axiosErrorHandler(error, '/log/search')
    throw e;

  }

};

export const getMenuLog = async () => {
  try {
    const response = await Axios.get("/config/menu");

    return response.data;

  } catch (error) {
    console.error("Error fetching menu log:", error);

    axiosErrorHandler(error, '/config/menu')
    throw error;

  }

};

export const getActionLog = async () => {
  try {
    const response = await Axios.get("/config/actionLog");

    return response.data;

  } catch (error) {
    console.error("Error fetching action log:", error);

    axiosErrorHandler(error, '/config/actionLog')
    throw error;

  }

};

export const searchLog = async (payload: AuditLogFilterPayload) => {
  try {
    const response = await Axios.post("/log/search", payload);

    return response.data;

  } catch (error) {
    console.error("Error search log:", error);

    axiosErrorHandler(error, '/log/search')
    throw error;

  }

};

export const fetchDetailLog = async ({ log_id }: { log_id: string }) => {
  try {
    const response = await Axios.post("/log/get", { log_id });

    return response.data;

  } catch (error) {
    console.error("Error fetch detail log:", error);

    axiosErrorHandler(error, '/log/get')
    throw error;

  }

};

export const disabled2Fa = async () => {
  try {
    const response = await Axios.get("/operator/twofa/disable");

    return response.data;

  } catch (error) {
    console.error("Error disabled 2fa:", error);

    axiosErrorHandler(error, '/operator/twofa/disable')
    throw error;

  }

};

export const setGoogleVerify = async ({ secret, pincode }: { secret: string, pincode: string }) => {
  try {
    const response = await Axios.post("/operator/twofa/set", { secret, pincode });

    return response.data;

  } catch (error) {
    console.error("Error set google verify:", error);

    const e = axiosErrorHandler(error, '/operator/twofa/set')
    throw error;

  }

};

export const sendEmailVerify = async ({ email }: { email: string }) => {
  try {
    const response = await Axios.post("/operator/email/send", { email });

    return response.data;

  } catch (error) {
    console.error("Error set google verify:", error);

    const e = axiosErrorHandler(error, '/operator/email/send')
    throw e;

  }

};

export const resendEmailVerify = async ({ email }: { email: string }) => {
  try {
    const response = await Axios.post("/operator/email/resend", { email });

    return response.data;

  } catch (error) {
    console.error("Error reset email:", error);

    const e = axiosErrorHandler(error, '/operator/email/resend')
    throw e;

  }

};

export const setEmailVerify = async ({ pincode, is_setup, email }: { pincode: string, is_setup: boolean, email: string }) => {
  try {
    const response = await Axios.post("/operator/email/verify", { pincode, is_setup, email });

    return response.data;

  } catch (error) {
    console.error("Error set email verify:", error);

    const e = axiosErrorHandler(error, '/operator/email/verify')
    throw e;

  }

};


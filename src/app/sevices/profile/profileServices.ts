import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchProfile = async () => {
  try {
    const response = await Axios.get("/operator/profile");



    return response.data;

  } catch (error) {
    console.error("Error fetching profile:", error);

    const e = axiosErrorHandler(error, '/operator/profile')
    throw e;
  }

};

export const setNewPassword = async ({ password }: { password: string }) => {
  try {
    const response = await Axios.patch("/operator/update/password", { password });

    return response.data;

  } catch (error) {
    console.error("Error set new password profile:", error);


    const e = axiosErrorHandler(error, '/operator/update/password')
    throw e;
  }

};

export const changePassword = async ({ current_password, new_password }: { current_password: string, new_password: string }) => {
  try {
    const response = await Axios.patch("/operator/password/change", { current_password, new_password });

    return response.data;

  } catch (error) {
    console.error("Error change password:", error);

    const e = axiosErrorHandler(error, '/operator/password/change')
    throw e;
  }

};

export const fetch2Fa = async () => {
  try {
    const response = await Axios.get("/operator/twofa/getType");

    return response.data;

  } catch (error) {
    console.error("Error fetch 2fa:", error);

    axiosErrorHandler(error, '/operator/twofa/getType')
    throw error;

  }

};

export const fetchQrCodeGoogle = async () => {
  try {
    const response = await Axios.get("/operator/twofa/generate");

    return response.data;

  } catch (error) {
    console.error("Error fetch 2fa:", error);

    axiosErrorHandler(error, '/operator/twofa/generate')
    throw error;

  }

};

export const verifyCodeGoogle = async ({ email, pincode }: { email: string, pincode: string }) => {
  try {
    const response = await Axios.post("/operator/twofa/verify", { email, pincode });

    return response.data;

  } catch (error) {
    console.error("Error verify code:", error);


    const e = axiosErrorHandler(error, '/operator/twofa/verify')
    throw e;
  }

};

export const verifyCodeEmail = async ({ email, pincode }: { email: string, pincode: string }) => {
  try {
    const response = await Axios.post("/operator/email/verify", { email, pincode });

    return response.data;

  } catch (error) {
    console.error("Error verify code email:", error);


    const e = axiosErrorHandler(error, '/operator/email/verify')
    throw e;
  }

};

export const sendLinkResetPassword = async ({ email }: { email: string }) => {
  try {
    const response = await Axios.post("/operator/password/reset/forgot", { email });

    return response.data;

  } catch (error) {
    console.error("Error send reset password:", error);


    const e = axiosErrorHandler(error, '/operator/password/reset/forgot')
    throw e;
  }

};


export const resetPasswordWithKey = async ({ password, key }: { password: string, key: string }) => {
  try {
    const response = await Axios.post("/operator/password/reset", { password, key });

    return response.data;

  } catch (error) {
    console.error("Error send reset password with key:", error);


    const e = axiosErrorHandler(error, '/operator/password/reset')
    throw e;
  }

};






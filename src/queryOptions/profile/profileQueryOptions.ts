import { disabled2Fa, resendEmailVerify, searchLoginLog, sendEmailVerify, setEmailVerify, setGoogleVerify } from "@/app/sevices/auditlog/auditlogService";
import { changePassword, fetch2Fa, fetchQrCodeGoogle } from "@/app/sevices/profile/profileServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useChangePasswordProfileMutationOption = () => {

  return useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      console.error("Error change password:", error);
    },

  });
};

export const useSearchLogProfileMutationOption = () => {

  return useMutation({
    mutationFn: searchLoginLog,
    onError: (error) => {
      console.error("Error search Login log:", error);
    },

  });
};

export function useFetch2FaMutationOption() {
  return useQuery({
    queryKey: ["actionLog"],
    queryFn: () => fetch2Fa(),
  });
}

export function useFetchQrCodeGoogleMutationOption() {
  return useQuery({
    queryKey: ["qrCodeGoogle"],
    queryFn: () => fetchQrCodeGoogle(),
  });
}

export const useDisabled2FaMutationOption = () => {

  return useMutation({
    mutationFn: disabled2Fa,
    onError: (error) => {
      console.error("Error disabled 2fa:", error);
    },

  });
};

export const useSetGoogleVerifyMutationOption = () => {

  return useMutation({
    mutationFn: setGoogleVerify,
    onError: (error) => {
      console.error("Error set google:", error);
    },

  });
};

export const useSendEmailMutationOption = () => {

  return useMutation({
    mutationFn: sendEmailVerify,
    onError: (error) => {
      console.error("Error send email:", error);
    },

  });
};

export const useReSendEmailMutationOption = () => {

  return useMutation({
    mutationFn: resendEmailVerify,
    onError: (error) => {
      console.error("Error resend email:", error);
    },

  });
};

export const useSetEmailMutationOption = () => {

  return useMutation({
    mutationFn: setEmailVerify,
    onError: (error) => {
      console.error("Error set email:", error);
    },

  });
};



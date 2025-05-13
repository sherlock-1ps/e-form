import { resetPasswordWithKey, sendLinkResetPassword, setNewPassword, verifyCodeEmail, verifyCodeGoogle } from "@/app/sevices/profile/profileServices";
import { useMutation } from "@tanstack/react-query";

export const useSetPasswordMutationOption = () => {

  return useMutation({
    mutationFn: setNewPassword,
    onError: (error) => {
      console.error("Error change password account:", error);
    },

  });
};

export const useVerifyGoogleMutationOption = () => {

  return useMutation({
    mutationFn: verifyCodeGoogle,
    onError: (error) => {
      console.error("Error verify google:", error);
    },

  });
};

export const useVerifyEmailMutationOption = () => {

  return useMutation({
    mutationFn: verifyCodeEmail,
    onError: (error) => {
      console.error("Error verify email:", error);
    },

  });
};

export const useSendResetPasswordMutationOption = () => {

  return useMutation({
    mutationFn: sendLinkResetPassword,
    onError: (error) => {
      console.error("Error send link reset password:", error);
    },

  });
};

export const useSetPasswordWithKeyMutationOption = () => {

  return useMutation({
    mutationFn: resetPasswordWithKey,
    onError: (error) => {
      console.error("Error reset password with key", error);
    },

  });
};


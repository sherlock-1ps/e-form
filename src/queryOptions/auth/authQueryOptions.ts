import { checkJwt } from "@/app/sevices/auth/authService";
import { useMutation } from "@tanstack/react-query";

export const useAuthAccountQueryOption = () => {

  return useMutation({
    mutationFn: checkJwt,
    onError: (error) => {
      console.error("Error auth jwt:", error);
    },

  });
};

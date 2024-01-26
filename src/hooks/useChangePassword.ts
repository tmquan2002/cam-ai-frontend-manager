import { useMutation } from "react-query";
import { ChangePasswordParams, LoginAPI } from "../apis/LoginAPI";

export const useChangePassword = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "change-password",
    mutationFn: async (params: ChangePasswordParams) => {
      return await LoginAPI._changePassword(params);
    },
  });

  return { mutate, isLoading, error, data };
};

import { useMutation } from "react-query";
import { ChangePasswordParams, ProfileAPI } from "../apis/ProfileAPI";

export const useChangePassword = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "change-password",
    mutationFn: async (params: ChangePasswordParams) => {
      return await ProfileAPI._changePassword(params);
    },
  });

  return { mutate, isLoading, error, data };
};

import { useMutation } from "react-query";
import { ProfileAPI, UpdateProfileParams } from "../apis/ProfileAPI";

export const useUpdateProfile = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["update", "profile"],
    mutationFn: async (params: UpdateProfileParams) => {
      return await ProfileAPI._updateProfile(params);
    },
  });

  return { mutate, isLoading, error, data };
};

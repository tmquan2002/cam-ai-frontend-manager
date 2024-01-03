import { useMutation } from "react-query";
import { LoginAPI, LoginParams } from "../apis/LoginAPI";

export const useLogin = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "login",
    mutationFn: async (params: LoginParams) => {
      return await LoginAPI.login(params);
    },
  });

  return { mutate, isLoading, error, data };
};
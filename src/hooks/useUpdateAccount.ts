import { useMutation } from "react-query";
import { AccountAPI, UpdateAccountParams } from "../apis/AccountAPI";

export const useUpdateAccount = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["update", "account"],
    mutationFn: async (params: UpdateAccountParams) => {
      return await AccountAPI._updateAccountById(params);
    },
  });

  return { mutate, isLoading, error, data };
};

import { UseMutationResult, useMutation } from "react-query";
import { AccountDetail } from "../models/Account";
import { AccountAPI, CreateAccountParams } from "../apis/AccountAPI";

export const useCreateAccount = () => {
  const {
    mutate,
    isLoading,
    error,
    data,
  }: UseMutationResult<AccountDetail, Error, CreateAccountParams> = useMutation(
    {
      mutationKey: ["create", "account"],
      mutationFn: async (params: CreateAccountParams) => {
        return await AccountAPI._createAccounts(params);
      },
    }
  );

  return { mutate, isLoading, error, data };
};

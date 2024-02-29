import { UseQueryResult, useQuery } from "react-query";
import { AccountAPI, GetAccountParams } from "../apis/AccountAPI";
import { CommonResponse } from "../models/Common";
import { AccountDetail } from "../models/Account";

export const useGetAccountList = (params: GetAccountParams) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<AccountDetail>, Error> = useQuery({
    queryKey: ["accounts", params],
    queryFn: async () => {
      return await AccountAPI._getAccounts(params);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

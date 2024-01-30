import { UseQueryResult, useQuery } from "react-query";
import { AccountAPI } from "../apis/AccountAPI";
import { CommonResponse } from "../models/Common";
import { AccountDetail } from "../models/Account";

export const useGetAccountList = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<CommonResponse<AccountDetail>, Error> = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return await AccountAPI._getAccounts();
    },
  });

  return { isError, isLoading, data, error };
};

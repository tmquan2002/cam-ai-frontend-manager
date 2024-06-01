import { UseQueryResult, useQuery } from "react-query";
import { AccountAPI } from "../apis/AccountAPI";
import { AccountDetail } from "../models/Account";

export const useGetAccountById = (id: string) => {
  const {
    isError,
    isLoading,
    isFetching,
    data,
    error,
    refetch
  }: UseQueryResult<AccountDetail, Error> = useQuery({
    queryKey: ["account", id],
    queryFn: async () => {
      return await AccountAPI._getAccountById(id);
    },
  });

  return { isError, isLoading, isFetching, data, error, refetch };
};

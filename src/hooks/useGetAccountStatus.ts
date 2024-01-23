import { UseQueryResult, useQuery } from "react-query";
import { LookupAPI } from "../apis/LookupAPI";
import { DicWithNumberKey } from "../models/Lookup";

export const useGetAccountStatusList = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<DicWithNumberKey, Error> = useQuery({
    queryKey: ["account-status"],
    queryFn: async () => {
      return await LookupAPI._getAccountStatus();
    },
  });

  return { isError, isLoading, data, error };
};

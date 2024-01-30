import { UseQueryResult, useQuery } from "react-query";
import { LookupAPI } from "../apis/LookupAPI";
import { DicWithStringKey } from "../models/Lookup";

export const useGetShopStatusList = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<DicWithStringKey, Error> = useQuery({
    queryKey: ["shop-status"],
    queryFn: async () => {
      return await LookupAPI._getShopStatus();
    },
  });

  return { isError, isLoading, data, error };
};

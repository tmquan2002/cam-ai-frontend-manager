import { UseQueryResult, useQuery } from "react-query";
import { LookupAPI } from "../apis/LookupAPI";
import { ProvinceDetail } from "../models/Address";

export const useGetProvinceList = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<ProvinceDetail[], Error> = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      return await LookupAPI._getProvinceList();
    },
  });

  return { isError, isLoading, data, error };
};

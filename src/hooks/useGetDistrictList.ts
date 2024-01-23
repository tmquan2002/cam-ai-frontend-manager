import { UseQueryResult, useQuery } from "react-query";
import { LookupAPI } from "../apis/LookupAPI";
import { DistrictDetail } from "../models/Address";

export const useGetDistrictList = (provinceId: number) => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<DistrictDetail[], Error> = useQuery({
    queryKey: ["Districts", provinceId],
    enabled: provinceId != 0,
    queryFn: async () => {
      return await LookupAPI._getDistrictList(provinceId);
    },
  });

  return { isError, isLoading, data, error };
};

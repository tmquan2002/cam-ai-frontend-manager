import { UseQueryResult, useQuery } from "react-query";
import { LookupAPI } from "../apis/LookupAPI";
import { WardDetail } from "../models/Address";

export const useGetWardList = (districtId: number) => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<WardDetail[], Error> = useQuery({
    queryKey: ["Wards", districtId],
    enabled: districtId != 0,
    queryFn: async () => {
      return await LookupAPI._getWardList(districtId);
    },
  });

  return { isError, isLoading, data, error };
};

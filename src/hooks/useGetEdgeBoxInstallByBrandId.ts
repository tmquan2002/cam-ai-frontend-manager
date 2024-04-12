import { CommonResponse } from './../models/Common';
import { UseQueryResult, useQuery } from "react-query";
import { EdgeBoxApi } from "../apis/EdgeBoxAPI";
import { EdgeBoxInstallDetail } from "../models/Edgebox";

export const useGetEdgeBoxInstallByBrandId = (brandId: string | null) => {
  const {
    isError,
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  }: UseQueryResult<CommonResponse<EdgeBoxInstallDetail>, Error> = useQuery({
    queryKey: ["EdgeBoxInstall", brandId],
    enabled: !!brandId,
    queryFn: async () => {
      return await EdgeBoxApi._getEdgeBoxInstallByBrandId(brandId ?? "");
    },
  });

  return { isError, isLoading, data, error, refetch, isFetching };
};

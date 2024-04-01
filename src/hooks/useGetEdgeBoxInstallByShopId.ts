import { CommonResponse } from './../models/Common';
import { UseQueryResult, useQuery } from "react-query";
import { EdgeBoxApi } from "../apis/EdgeBoxAPI";
import { EdgeBoxInstallDetail } from "../models/Edgebox";

export const useGetEdgeBoxInstallByShopId = (shopId: string) => {
  const {
    isError,
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  }: UseQueryResult<CommonResponse<EdgeBoxInstallDetail>, Error> = useQuery({
    queryKey: ["EdgeBoxInstall", shopId],
    queryFn: async () => {
      return await EdgeBoxApi._getEdgeBoxInstallByShopId(shopId);
    },
  });

  return { isError, isLoading, data, error, refetch, isFetching };
};

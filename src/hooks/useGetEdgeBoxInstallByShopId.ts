import { UseQueryResult, useQuery } from "react-query";
import { EdgeBoxInstallDetail } from "../models/Edgebox";
import { EdgeBoxApi } from "../apis/EdgeBoxAPI";

export const useGetEdgeBoxInstallByShopId = (shopId: string) => {
  const {
    isError,
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  }: UseQueryResult<EdgeBoxInstallDetail[], Error> = useQuery({
    queryKey: ["EdgeBoxInstall", shopId],
    queryFn: async () => {
      return await EdgeBoxApi._getEdgeBoxInstallByShopId(shopId);
    },
  });

  return { isError, isLoading, data, error, refetch, isFetching };
};

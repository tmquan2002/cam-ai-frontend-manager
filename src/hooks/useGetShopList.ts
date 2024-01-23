import { UseQueryResult, useQuery } from "react-query";
import { GetShopListParams, ShopAPI } from "../apis/ShopAPI";
import { CommonResponse } from "../models/Common";
import { ShopDetail } from "../models/Shop";

export const useGetShopList = (params: GetShopListParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<ShopDetail>, Error> = useQuery({
    enabled: params.enabled,
    queryKey: ["shops", params],
    queryFn: async () => {
      return await ShopAPI._getShopList(params);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

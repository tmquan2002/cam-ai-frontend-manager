import { UseQueryResult, useQuery } from "react-query";
import { ShopDetail } from "../models/Shop";
import { ShopAPI } from "../apis/ShopAPI";

export const useGetShopById = (shopId: string) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<ShopDetail, Error> = useQuery({
    queryKey: ["shop", shopId],
    queryFn: async () => {
      return await ShopAPI._getShopById(shopId);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

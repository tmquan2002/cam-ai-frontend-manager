import { UseMutationResult, useMutation } from "react-query";
import { ShopAPI, CreateShopParams } from "../apis/ShopAPI";
import { ShopDetail } from "../models/Shop";

export const useCreateShop = () => {
  const {
    mutate,
    isLoading,
    error,
    data,
  }: UseMutationResult<ShopDetail, Error, CreateShopParams> = useMutation({
    mutationKey: ["create", "shop"],
    mutationFn: async (params: CreateShopParams) => {
      return await ShopAPI._createShop(params);
    },
  });

  return { mutate, isLoading, error, data };
};

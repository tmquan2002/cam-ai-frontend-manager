import { useMutation } from "react-query";
import { ShopAPI } from "../apis/ShopAPI";

export const useDeleteShopById = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["delete", "shop"],
    mutationFn: async (shopId: string) => {
      return await ShopAPI._deleteShopById(shopId);
    },
  });

  return { mutate, isLoading, error, data };
};

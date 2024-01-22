import { useMutation } from "react-query";
import { ShopAPI, UpdateShopParams } from "../apis/ShopAPI";

export const useUpdateShopById = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["update", "shop"],
    mutationFn: async (params: UpdateShopParams) => {
      return await ShopAPI._updateShopById(params);
    },
  });

  return { mutate, isLoading, error, data };
};

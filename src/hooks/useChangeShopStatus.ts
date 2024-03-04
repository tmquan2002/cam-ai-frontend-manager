import { ShopStatus } from "../models/CamAIEnum";
import { ShopAPI } from "../apis/ShopAPI";
import { useMutation } from "react-query";

export const useChangeShopStatus = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "change-shop-status",
    mutationFn: async ({
      shopId,
      status,
    }: {
      status: ShopStatus;
      shopId: string;
    }) => {
      return await ShopAPI._changeShopStatus(status, shopId);
    },
  });

  return { mutate, isLoading, error, data };
};

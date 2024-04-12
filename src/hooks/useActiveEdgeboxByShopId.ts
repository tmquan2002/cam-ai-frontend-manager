import { useMutation } from "react-query";
import { ActiveEdgeBoxParams, EdgeBoxApi } from "../apis/EdgeBoxAPI";

export const useActiveEdgeBoxByShopId = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "active-edgeBox",
    mutationFn: async (params: ActiveEdgeBoxParams) => {
      return await EdgeBoxApi._activeEdgeBoxByShopId(params);
    },
  });

  return { mutate, isLoading, error, data };
};

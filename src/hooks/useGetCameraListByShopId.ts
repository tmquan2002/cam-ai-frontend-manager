import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { CameraDetail } from "../models/Camera";
import { CameraAPI } from "../apis/Camera";

export const useGetCameraListByShopId = (shopId: string | undefined) => {
  const {
    isError,
    isLoading,
    data,
    refetch,
    error,
  }: UseQueryResult<CommonResponse<CameraDetail>, Error> = useQuery({
    queryKey: ["brands"],
    enabled: !!shopId,
    queryFn: async () => {
      return await CameraAPI._getCameraListByShopId(shopId??"");
    },
  });

  return { isError, isLoading, data, error, refetch };
};

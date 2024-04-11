import { UseQueryResult, useQuery } from "react-query";
import { CameraAPI } from "../apis/Camera";

export const useGetCameraLiveUrl = (cameraId:string| undefined | null) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: UseQueryResult<string, Error> = useQuery({
    queryKey: ["camera", cameraId],
    enabled: !!cameraId,
    queryFn: async () => {
      return await CameraAPI._getCameraLiveUrl(cameraId??"");
    },
  });

  return { isError, isLoading, data, error, refetch };
};

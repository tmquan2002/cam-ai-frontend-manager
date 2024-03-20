import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { EdgeboxDetail } from "../models/Edgebox";
import { EdgeBoxApi } from "../apis/EdgeBoxAPI";

export const useGetEdgeBoxList = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<CommonResponse<EdgeboxDetail>, Error> = useQuery({
    queryKey: ["Edgeboxes"],
    queryFn: async () => {
      return await EdgeBoxApi._getEdgeBoxList();
    },
  });

  return { isError, isLoading, data, error };
};

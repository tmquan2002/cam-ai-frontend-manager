import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { GetIncidentParams, IncidentApi } from "../apis/IncidentAPI";
import { IncidentDetail } from "../models/Incident";

export const useGetIncidentList = (params: GetIncidentParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
  }: UseQueryResult<CommonResponse<IncidentDetail>, Error> = useQuery({
    queryKey: ["incidents", params],
    queryFn: async () => {
      return await IncidentApi._getIncidentList(params);
    },
  });

  return { isError, isLoading, data, error };
};

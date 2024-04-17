import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { GetIncidentParams, IncidentApi } from "../apis/IncidentAPI";
import { IncidentDetail } from "../models/Incident";

export const useGetIncidentList = ({
  enabled,
  ...rest
}: GetIncidentParams & {
  enabled?: boolean;
}) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<IncidentDetail>, Error> = useQuery({
    queryKey: ["incidents", rest],
    enabled: enabled ?? true,
    queryFn: async () => {
      return await IncidentApi._getIncidentList(rest);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

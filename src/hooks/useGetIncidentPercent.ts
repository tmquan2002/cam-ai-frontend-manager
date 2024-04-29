import { UseQueryResult, useQuery } from "react-query";
import { GetIncidentPercentParams, IncidentApi } from "../apis/IncidentAPI";
import { IncidentPercentDetail } from "../models/Incident";

export const useGetIncidentPercent = ({
  enabled,
  ...rest
}: GetIncidentPercentParams & {
  enabled?: boolean;
}) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<IncidentPercentDetail, Error> = useQuery({
    queryKey: ["incident-percent", rest],
    enabled: enabled ?? true,
    queryFn: async () => {
      return await IncidentApi._getIncidentPercent(rest);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

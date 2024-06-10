import { UseQueryResult, useQuery } from "react-query";
import { IncidentApi } from "../apis/IncidentAPI";
import { IncidentDetail } from "../models/Incident";

export const useGetIncidentByAssignmentId = (params: {
  id: string;
  enabled: boolean;
}) => {
  const { id, enabled } = params;
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: UseQueryResult<IncidentDetail[], Error> = useQuery({
    queryKey: ["incidents", "assignment", params],
    enabled: enabled,
    queryFn: async () => {
      return await IncidentApi._getIncidentByAssignmentId(id);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

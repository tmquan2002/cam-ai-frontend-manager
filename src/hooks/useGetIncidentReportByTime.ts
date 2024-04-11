import { UseQueryResult, useQuery } from "react-query";
import {
  GetIncidentReportByTimeParams,
  IncidentApi,
} from "../apis/IncidentAPI";
import { IncidentReportByTimeDetail } from "../models/Report";

export const useGetIncidentReportByTime = (
  params: GetIncidentReportByTimeParams & { enabled: boolean }
) => {
  const { enabled, ...rest } = params;

  const {
    isError,
    isLoading,
    data,
    error,
  }: UseQueryResult<IncidentReportByTimeDetail, Error> = useQuery({
    queryKey: ["incidents-time", params],
    enabled: enabled,
    queryFn: async () => {
      return await IncidentApi._getIncidentReportByTime(rest);
    },
  });

  return { isError, isLoading, data, error };
};

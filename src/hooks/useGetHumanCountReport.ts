import { UseQueryResult, useQuery } from "react-query";
import { GetShopHumanCountReportParams, ReportApi } from "../apis/ReportAPI";
import { HumanCountDetail } from "../models/Report";

export const useShopHumanCountReport = ({
  enabled,
  ...params
}: GetShopHumanCountReportParams & { enabled?: boolean }) => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<HumanCountDetail, Error> = useQuery({
    queryKey: ["report", "count", "employee", "interaction", params],
    enabled: enabled ?? true,
    queryFn: async () => {
      return await ReportApi._getHumanCountReport(params);
    },
  });

  return { isError, isLoading, data, error };
};

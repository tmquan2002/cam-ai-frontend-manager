import { UseQueryResult, useQuery } from "react-query";
import { GetShopHumanCountReportParams, ReportApi } from "../apis/ReportAPI";
import { HumanCountDetail } from "../models/Report";

export const useShopHumanCountReport = (
  params: GetShopHumanCountReportParams
) => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<HumanCountDetail, Error> = useQuery({
    queryKey: ["report", "count", "employee", params],
    enabled: !!params,
    queryFn: async () => {
      return await ReportApi._getHumanCountReport(params);
    },
  });

  return { isError, isLoading, data, error };
};

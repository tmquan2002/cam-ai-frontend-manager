import { UseQueryResult, useQuery } from "react-query";
import {
  GetShopHumanCountReportByShopIdParams,
  ReportApi,
} from "../apis/ReportAPI";
import { HumanCountDetail } from "../models/Report";

export const useGetShopHumanCountReportByShopId = ({
  enabled,
  ...params
}: GetShopHumanCountReportByShopIdParams & { enabled?: boolean }) => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<HumanCountDetail, Error> = useQuery({
    queryKey: ["report", "count", "employee", "interaction", "shopId", params],
    enabled: enabled ?? true,
    queryFn: async () => {
      return await ReportApi._getHumanCountReportByShopId(params);
    },
  });

  return { isError, isLoading, data, error };
};

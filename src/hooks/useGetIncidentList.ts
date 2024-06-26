import _ from "lodash";
import { UseQueryResult, useQuery } from "react-query";
import { GetIncidentParams, IncidentApi } from "../apis/IncidentAPI";
import { CommonResponse } from "../models/Common";
import { IncidentDetail } from "../models/Incident";


export type IncidentDetailWithChecked = IncidentDetail & {
  checked: boolean;
  disabled: boolean;
}
export const useGetIncidentList = ({ enabled, ...rest }: GetIncidentParams & { enabled?: boolean; }) => {
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

export const useGetOrderedIncidentListChecked = (params: GetIncidentParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<IncidentDetailWithChecked>, Error> = useQuery({
    queryKey: ["orderedIncidents", params],
    queryFn: async () => {
      const response = await IncidentApi._getIncidentList(params)

      const orderedCheckedResponse = _.orderBy(
        response?.values || [],
        ["startTime"],
        ["desc"]
      ).map((item) => ({
        ...item,
        checked: false,
        disabled: false,
      }))
      return { ...response, values: orderedCheckedResponse }
    },
  });

  return { isError, isLoading, data, error, refetch };
};

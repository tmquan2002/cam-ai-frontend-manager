import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { GetIncidentParams, IncidentApi } from "../apis/IncidentAPI";
import { IncidentDetail } from "../models/Incident";
import { IncidentType } from "../models/CamAIEnum";
import _ from "lodash";

export type IncidentDetailWithChecked = IncidentDetail & {
  checked: boolean;
  disabled: boolean;
}
export const useGetIncidentList = (params: GetIncidentParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<IncidentDetail>, Error> = useQuery({
    queryKey: ["incidents", params],
    queryFn: async () => {
      return await IncidentApi._getIncidentList(params);
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
  }: UseQueryResult<IncidentDetailWithChecked[], Error> = useQuery({
    queryKey: ["orderedIncidents", params],
    queryFn: async () => {
      const response = await IncidentApi._getIncidentList(params)

      const orderedCheckedResponse = _.orderBy(
        response?.values || [],
        ["startTime"],
        ["desc"]
      ).filter((i) => i.incidentType != IncidentType.Interaction)
        .map((item) => ({
          ...item,
          checked: false,
          disabled: false,
        }))
      return orderedCheckedResponse
    },
  });

  return { isError, isLoading, data, error, refetch };
};

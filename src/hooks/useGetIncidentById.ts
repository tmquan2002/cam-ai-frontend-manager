import { UseQueryResult, useQuery } from "react-query";
import { IncidentDetail } from "../models/Incident";
import { IncidentApi } from "../apis/IncidentAPI";

export const useGetIncidentById = (id: string | null) => {
  const {
    isError,
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  }: UseQueryResult<IncidentDetail, Error> = useQuery({
    queryKey: ["Incident", id],
    enabled: !!id,
    queryFn: async () => {
      return await IncidentApi._getIncidentById(id??"");
    },
  });

  return { isError, isLoading, data, error, refetch, isFetching };
};

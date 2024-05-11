import { UseQueryResult, useQuery } from "react-query";
import { CalendarAPI, GetAssignHistoryParams } from "../apis/CalendarAPI";
import { SuperVisorAssignmentDetail } from "../models/Shop";

export const useGetSupervisorAssignmentHistory = (
  params: GetAssignHistoryParams
) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<SuperVisorAssignmentDetail, Error> = useQuery({
    queryKey: ["assignment", params],
    queryFn: async () => {
      return await CalendarAPI._getAssignHistory(params);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

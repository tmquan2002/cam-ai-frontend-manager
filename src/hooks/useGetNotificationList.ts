import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { NotificationDetail } from "../models/Notification";
import { GetNotificationParams, NotificationAPI } from "../apis/Notification";

export const useGetNotificationList = (params: GetNotificationParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<NotificationDetail>, Error> = useQuery({
    queryKey: ["Notifications", params],
    queryFn: async () => {
      return await NotificationAPI._getNotificationList(params);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

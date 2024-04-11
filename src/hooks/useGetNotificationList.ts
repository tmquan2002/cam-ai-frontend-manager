import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { NotificationDetail } from "../models/Notification";
import { NotificationAPI } from "../apis/Notification";

export const useGetNotificationList = () => {
  const {
    isError,
    isLoading,
    data,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<NotificationDetail>, Error> = useQuery({
    queryKey: ["Notifications"],
    queryFn: async () => {
      return await NotificationAPI._getNotificationList();
    },
  });

  return { isError, isLoading, data, error, refetch };
};

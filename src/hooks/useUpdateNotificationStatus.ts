import { useMutation } from "react-query";
import { NotificationAPI, UpdateNotificationStatusParams } from "../apis/Notification";

export const useUpdateNotificationStatus = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["update", "notification"],
    mutationFn: async (
      params: UpdateNotificationStatusParams 
    ) => {
      return await NotificationAPI._updateNotificationStatus(params);
    },
  });

  return { mutate, isLoading, error, data };
};

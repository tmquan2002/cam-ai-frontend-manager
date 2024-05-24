import { useMutation } from "react-query";
import { NotificationAPI } from "../apis/Notification";

export const useUpdateAllNotificationStatus = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["updateAllNotification"],
    mutationFn: async () => {
      return await NotificationAPI._updateAllNotificationStatus();
    },
  });

  return { mutate, isLoading, error, data };
};

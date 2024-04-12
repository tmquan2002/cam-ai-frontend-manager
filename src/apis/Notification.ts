import { getAccessToken } from "../context/AuthContext";
import { NotificationStatus } from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import { NotificationDetail } from "../models/Notification";
import http from "../utils/http";

export type UpdateNotificationStatusParams = {
  notificationId: string,
  status: NotificationStatus
}

export const NotificationAPI = {
    _getNotificationList: async () => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<NotificationDetail>>(`/api/notifications`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
    
        return res?.data;
    },
    _updateNotificationStatus: async ({notificationId,status}: UpdateNotificationStatusParams) =>{
      const access_token = getAccessToken();
      const res = await http.patch(`/api/notifications/${notificationId}/status/${status}`,{}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      return res?.data;
    }
}
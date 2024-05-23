import { getAccessToken } from "../context/AuthContext";
import { NotificationStatus } from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import { NotificationDetail } from "../models/Notification";
import http, { toQueryParams } from "../utils/http";

export type UpdateNotificationStatusParams = {
  notificationId: string;
  status: NotificationStatus;
};

export type GetNotificationParams = {
  accountId?: string;
  notificationId?: string;
  status?: NotificationStatus;
  size?: number;
  pageIndex?: number;
};

export const NotificationAPI = {
  _getNotificationList: async (params: GetNotificationParams) => {
    const access_token = getAccessToken();
    const res = await http.get<CommonResponse<NotificationDetail>>(
      `/api/notifications?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _updateNotificationStatus: async ({
    notificationId,
    status,
  }: UpdateNotificationStatusParams) => {
    const access_token = getAccessToken();
    const res = await http.patch(
      `/api/notifications/${notificationId}/status/${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _updateAllNotificationStatus: async () => {
    const access_token = getAccessToken();
    const res = await http.patch(
      `/api/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res?.data;
  },
};

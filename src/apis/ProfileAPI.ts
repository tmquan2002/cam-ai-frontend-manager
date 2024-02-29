import { getAccessToken } from "../context/AuthContext";
import { AccountDetail } from "../models/Account";
import http from "../utils/http";

export type ChangePasswordParams = {
  oldPassword: string;
  newPassword: string;
  newPasswordRetype: string;
};

export const ProfileAPI = {
  _getProfile: async () => {
    const access_token = getAccessToken();
    const res = await http.get<AccountDetail>(`/api/profile`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _changePassword: async (params: ChangePasswordParams) => {
    const access_token = getAccessToken();

    const res = await http.post(`/api/auth/password`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  },
};

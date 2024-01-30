import { getAccessToken, getUserId } from "../context/AuthContext";
import http from "../utils/http";

export type UpdateAccountParams = {
  email: string;
  name: string;
  gender: string;
  phone: string;
  birthday: string;
  wardId: number;
  addressLine: string;
};

export const AccountAPI = {
  _getAccountById: async (id: string) => {
    const res = await http.get(`/api/accounts/${id}`);
    return res.data;
  },
  _updateAccountById: async (params: UpdateAccountParams) => {
    const access_token = getAccessToken();
    const accountId = getUserId();

    const res = await http.put(`/api/accounts/${accountId}`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  },
  _getAccounts: async () => {
    const access_token = getAccessToken();
    const res = await http.get(`/api/accounts`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  },
};

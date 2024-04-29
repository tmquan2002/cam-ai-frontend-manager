import { getAccessToken } from "../context/AuthContext";
import { AccountStatus, Gender, Role } from "../models/CamAIEnum";
import http, { toQueryParams } from "../utils/http";

export type UpdateAccountParams = {
  name: string;
  gender: Gender | null;
  phone: string;
  birthday: string | null;
  wardId: number;
  addressLine: string;
  userId: string;
};
export type CreateAccountParams = {
  email: string;
  name: string;
  gender: Gender | null;
  phone: string;
  birthday: string;
  wardId: number | null;
  addressLine: string | null;
  brandId: string;
  role: Role;
};

export type GetAccountParams = {
  name?: string;
  email?: string;
  accountStatus?: AccountStatus;
  role?: Role;
  brandId?: string;
  size?: number;
  pageIndex?: number;
};

export const AccountAPI = {
  _getAccountById: async (id: string) => {
    const res = await http.get(`/api/accounts/${id}`);
    return res.data;
  },
  _updateAccountById: async (params: UpdateAccountParams) => {
    const access_token = getAccessToken();
    const { userId, ...rest } = params;

    const res = await http.put(`/api/accounts/${userId}`, rest, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  },
  _getAccounts: async (params: GetAccountParams) => {
    const access_token = getAccessToken();
    const res = await http.get(`/api/accounts?${toQueryParams(params)}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  },
  _createAccounts: async (params: CreateAccountParams) => {
    const access_token = getAccessToken();

    const res = await http.post(`/api/accounts`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  },
};

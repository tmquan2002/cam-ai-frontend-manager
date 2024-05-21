import { getAccessToken } from "../context/AuthContext";
import { ShopStatus } from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import { Progress } from "../models/Task";
import { ShopDetail } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type GetShopListParams = {
  name?: string;
  phone?: string;
  wardId?: number;
  status?: string | null;
  brandId?: string;
  shopManagerId?: string;
  size?: number;
  pageIndex?: number;
};

export type UpdateShopParams = {
  shopId: string;
  name?: string;
  phone?: string | null;
  wardId?: string;
  shopManagerId?: string;
  addressLine?: string;
  openTime?: string;
  closeTime?: string;
};

export type CreateShopParams = {
  name: string;
  phone: string | null;
  wardId: number;
  shopManagerId: string | null;
  addressLine: string;
  openTime: string;
  closeTime: string;
};

export const ShopAPI = {
  _getShopList: async (params: GetShopListParams) => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<ShopDetail>>(
      `/api/shops?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },

  _getShopById: async (shopId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<ShopDetail>(`/api/shops/${shopId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _updateShopById: async ({ shopId, ...updateParams }: UpdateShopParams) => {
    const access_token = getAccessToken();

    const res = await http.put(`/api/shops/${shopId}`, updateParams, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _createShop: async (params: CreateShopParams) => {
    const access_token = getAccessToken();

    const res = await http.post(`/api/shops`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _changeShopStatus: async (status: ShopStatus, shopId: string) => {
    const access_token = getAccessToken();

    const res = await http.patch(
      `/api/shops/${shopId}/status/${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _deleteShopById: async (shopId: string) => {
    const access_token = getAccessToken();

    const res = await http.delete(`/api/shops/${shopId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _uploadShopFile: async (params: { file: File }) => {
    const access_token = getAccessToken();
    const form = new FormData();
    form.append("file", params.file);

    const res = await http.post<{ taskId: string, message: string }>(`/api/shops/upsert`, form, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data;
  },

  _getShopUpsertTask: async () => {
    const access_token = getAccessToken();

    const res = await http.get<string[]>(`/api/shops/upsert/task`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _getShopUpsertTaskResult: async (taskId: string | undefined) => {
    const access_token = getAccessToken();

    const res = await http.get<Progress>(`/api/shops/upsert/task/${taskId}/result`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _getShopProgress: async (taskId: string | undefined) => {
    const access_token = getAccessToken();

    const res = await http.get<Progress>(`/api/shops/upsert/task/${taskId}/progress`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
};

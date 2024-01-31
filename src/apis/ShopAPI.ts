import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { ShopDetail } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type GetShopListParams = {
  name?: string;
  phone?: string;
  wardId?: number;
  statusId?: number | null;
  brandId?: string;
  shopManagerId?: string;
  size: number;
  pageIndex?: number;
};

export type UpdateShopParams = {
  shopId: string;
  name?: string;
  phone?: string;
  wardId?: string;
  brandId?: string;
  shopManagerId?: string;
  addressLine?: string;
};

export type CreateShopParams = {
  name: string;
  phone: string;
  wardId: number;
  shopManagerId: string;
  addressLine: string;
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

    const res = await http.put<any>(`/api/shops/${shopId}`, updateParams, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _createShop: async (params: CreateShopParams) => {
    const access_token = getAccessToken();

    const res = await http.post<any>(`/api/shops`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
};

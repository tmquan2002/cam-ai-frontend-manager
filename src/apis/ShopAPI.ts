import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { ShopDetail } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type GetShopListParams = {
  name?: string;
  statusId?: string;
  brandId?: string;
  shopManagerId?: string;
  size: number;
  pageIndex?: number;
  enabled: boolean;
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

    const res = await http.put<ShopDetail>(
      `/api/shops/${shopId}`,
      updateParams,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
};

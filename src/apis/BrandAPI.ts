import { getAccessToken } from "../context/AuthContext";
import { BrandDetail } from "../models/Brand";
import { CommonResponse } from "../models/Common";
import http, { toQueryParams } from "../utils/http";

export type GetBrandListParams = {
  name?: string;
  statusId?: string;
  brandId?: string;
  size: number;
  pageIndex?: number;
};

export const BrandApi = {
  _getBrandList: async (params: GetBrandListParams) => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<BrandDetail>>(
      `/api/brands?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
};

import { getAccessToken } from "../context/AuthContext";
import { ReportInterval } from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import { ChartReportData, HumanCountDetail } from "../models/Report";
import http, { toQueryParams } from "../utils/http";

export type GetReportListParams = {
  shopId: string;
  date?: string;
};

export type GetShopHumanCountReportParams = {
  startDate?: string;
  endDate?: string;
  interval: ReportInterval;
};

export type GetShopHumanCountReportByShopIdParams = {
  startDate?: string;
  endDate?: string;
  interval: ReportInterval;
  shopId: string;
};

export const ReportApi = {
  _getReportShopList: async (date?: string) => {
    const access_token = getAccessToken();
    const res = await http.get<CommonResponse<ChartReportData>>(
      `/api/shops/customer?${toQueryParams(date)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res?.data;
  },
  _getReportShopById: async ({ shopId, date }: GetReportListParams) => {
    const access_token = getAccessToken();
    const res = await http.get<CommonResponse<ChartReportData>>(
      `/api/shops/${shopId}/customer?${toQueryParams(date)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res?.data;
  },
  _getHumanCountReport: async (params: GetShopHumanCountReportParams) => {
    const access_token = getAccessToken();
    const res = await http.get<HumanCountDetail>(
      `/api/shops/customer?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res?.data;
  },
  _getHumanCountReportByShopId: async (
    params: GetShopHumanCountReportByShopIdParams
  ) => {
    const access_token = getAccessToken();
    const res = await http.get<HumanCountDetail>(
      `/api/shops/${params.shopId}/customer?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res?.data;
  },
};

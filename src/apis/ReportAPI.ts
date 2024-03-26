import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { ChartReportData } from "../models/Report";
import http, { toQueryParams } from "../utils/http";

export type GetReportListParams = {
    shopId: string;
    date?: string;
};
export const ReportApi = {
    _getReportShopList: async (date?: string) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<ChartReportData>>(`/api/shops/customer?${toQueryParams(date)}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res?.data;
    },
    _getReportShopById: async ({ shopId, date }: GetReportListParams) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<ChartReportData>>(`/api/shops/${shopId}/customer?${toQueryParams(date)}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res?.data;
    },
};
import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { ChartReportData } from "../models/Report";
import http from "../utils/http";

export const ReportApi = {
    _getReportShopList: async () => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<ChartReportData>>(`/api/shops/customer`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res?.data;
    },
    _getReportShopById: async (shopId: string) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<ChartReportData>>(`/api/shops/${shopId}/customer`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res?.data;
    },
};

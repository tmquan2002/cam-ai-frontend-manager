import { getAccessToken } from "../context/AuthContext";
import http from "../utils/http";

export const FilesAPI = {
    _getShopTemplate: async () => {
        const access_token = getAccessToken();
        const res = await http.get(`/api/files/download/shop-csv`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res;
    },
    _getEmployeeTemplate: async () => {
        const access_token = getAccessToken();
        const res = await http.get(`/api/files/download/employee-csv`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res;
    },
}
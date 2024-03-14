import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { Incident } from "../models/Incident";
import http from "../utils/http";

export const IncidentAPI = {
    _getIncidentById: async (incidentId: string) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<Incident>>(
            `/api/requests/${incidentId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res?.data;
    },
}
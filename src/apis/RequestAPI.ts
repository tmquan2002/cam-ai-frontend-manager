import { getAccessToken } from "../context/AuthContext";
import { RequestStatus, RequestType } from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import http, { toQueryParams } from "../utils/http";

export type GetRequestsParams = {
    type?: RequestType;
    accountId?: string;
    brandId?: string;
    shopId?: string;
    edgeBoxId?: string;
    hasReply?: boolean
    status?: RequestStatus;
    size?: string | number | null;
    pageIndex?: number;
}

export type CreateRequestParams = {
    requestType: RequestType;
    shopId: string;
    edgeBoxId: string;
    detail: string;
}

export type GetProfileRequestsParams = {
    type?: RequestType;
    hasReply?: boolean
    status?: RequestStatus;
    size?: string | number | null;
    pageIndex?: number;
}

export const RequestAPI = {
    _getAllFilter: async (params: GetRequestsParams) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<Request>>(
            `/api/requests?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    },
    _makeRequest: async (params: CreateRequestParams) => {
        const access_token = getAccessToken();
        const res = await http.post<Request>(`/api/requests`, params, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return res?.data;
    },
    _getProfileOtherRequest: async (params: GetProfileRequestsParams) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<Request>>(
            `/api/profile/requests?${toQueryParams(params)}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    },
    _getRequestById: async (requestId: string) => {
        const access_token = getAccessToken();
        const res = await http.get<CommonResponse<Request>>(
            `/api/requests/${requestId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res?.data;
    },
};
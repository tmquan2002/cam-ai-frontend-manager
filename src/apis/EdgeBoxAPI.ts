import { getAccessToken } from "../context/AuthContext";
import { EdgeBoxInstall } from "../models/EdgeBox";
import http from "../utils/http";

export type AddEdgeBoxInstallParams = {
    edgeBoxId: string;
    shopId: string;
    ipAddress?: string;
    port?: string;
    validFrom: string;
    validUntil: string;
}

export type ActivateEdgeBoxInstallParams = {
    shopId: string;
    activationCode: string;
};

export const EdgeBoxAPI = {
    _getAllInstallShop: async (shopId: string) => {
        const access_token = getAccessToken();
        const res = await http.get<EdgeBoxInstall[]>(
            `/api/shops/${shopId}/installs`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    },
    _getAllInstallBrand: async (brandId: string) => {
        const access_token = getAccessToken();
        const res = await http.get<EdgeBoxInstall[]>(
            `/api/brands/${brandId}/installs`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    },
    _installEdgeBox: async (params: AddEdgeBoxInstallParams) => {
        const access_token = getAccessToken();
        const res = await http.post(`/api/edgeboxinstalls`, params, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res.data;
    },
    _activateEdgeBox: async (params: ActivateEdgeBoxInstallParams) => {
        const access_token = getAccessToken();
        const res = await http.put(`/api/edgeboxinstalls`, params, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return res.data;
    },
};

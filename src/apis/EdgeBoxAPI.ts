import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { EdgeBoxInstallDetail, EdgeboxDetail } from "../models/Edgebox";
import http from "../utils/http";


export type ActiveEdgeBoxParams = {
  shopId: string,
  activationCode: string
}

export const EdgeBoxApi = {
  _getEdgeBoxList: async () => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<EdgeboxDetail>>(
      `/api/edgeboxes`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _getEdgeBoxInstallByShopId: async (shopId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<EdgeBoxInstallDetail[]>(
      `/api/shops/${shopId}/installs`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _activeEdgeBoxByShopId: async (params: ActiveEdgeBoxParams) => {
    const access_token = getAccessToken();

    const res = await http.put(
      `/api/edgeboxinstalls`,params,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _getEdgeBoxInstallByBrandId: async (brandId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<EdgeBoxInstallDetail[]>(
      `/api/brands/${brandId}/installs`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  }
};

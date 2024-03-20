import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { EdgeBoxInstallDetail, EdgeboxDetail } from "../models/Edgebox";
import http from "../utils/http";

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
};

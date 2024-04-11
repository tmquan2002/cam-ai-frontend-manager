import { getAccessToken } from "../context/AuthContext";
import { CameraDetail } from "../models/Camera";
import { CommonResponse } from "../models/Common";
import http from "../utils/http";

export const CameraAPI = {
  _getCameraListByShopId: async (shopId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<CameraDetail>>(
      `/api/shops/${shopId}/cameras`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _getCameraLiveUrl: async (cameraId: string) => {
    const access_token = getAccessToken();

    const res = await http.post<string>(
      `/api/cameras/${cameraId}/stream`,{},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  }
};

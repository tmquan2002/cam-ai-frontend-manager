import { getAccessToken } from "../context/AuthContext";
import http, { toQueryParams } from "../utils/http";

export type GetImageParams = {
  id: string;
  width?: number;
  height?: number;
  scaleFactor?: number;
};

export const ImageAPI = {
  _getImageById: async (params: GetImageParams) => {
    const { id, ...rest } = params;
    const access_token = getAccessToken();

    const res = await http.get(`/api/images/${id}/${toQueryParams(rest)}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "image/jpeg",
      },
    });
    return res?.data;
  },
};

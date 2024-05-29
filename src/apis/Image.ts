import http, { toQueryParams } from "../utils/http";

export type GetImageParams = {
  id: string;
  width?: number;
  height?: number;
  scaleFactor?: number;
};

export const ImageAPI = {
  _getImageById: async ({ id, ...rest }: GetImageParams) => {
    const res = await http.get(`/api/images/${id}?${toQueryParams(rest)}`, {
      responseType: "arraybuffer",
    });

    return res?.data;
  },
};

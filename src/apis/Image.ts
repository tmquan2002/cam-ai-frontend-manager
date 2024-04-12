import http from "../utils/http";

export const ImageAPI = {
  _getImageById: async (imageId: string) => {
    const res = await http.get(`/api/images/${imageId}`, {
      responseType: "arraybuffer",
    });

    return res?.data;
  },
};

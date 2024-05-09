import { FileWithPath } from "@mantine/dropzone";
import { getAccessToken } from "../context/AuthContext";
import { BrandDetail } from "../models/Brand";
import { CommonResponse } from "../models/Common";
import http, { toQueryParams } from "../utils/http";

export type GetBrandListParams = {
  name?: string;
  statusId?: string;
  brandId?: string;
  size?: number;
  pageIndex?: number;
};

export enum UploadBrandImageType {
  Banner = "banner",
  Logo = "Logo",
}

export type UploadBrandImageParams = {
  file: FileWithPath;
  type: UploadBrandImageType;
};

export const BrandApi = {
  _getBrandList: async (params: GetBrandListParams) => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<BrandDetail>>(
      `/api/brands?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _uploadBrandImage: async ({ file, type }: UploadBrandImageParams) => {
    const access_token = getAccessToken();
    const form = new FormData();
    form.append("File", file);

    const res = await http.put(`/api/brands/images/${type}`, form, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data;
  },
};

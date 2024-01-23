import { UseQueryResult, useQuery } from "react-query";
import { BrandDetail } from "../models/Brand";
import { CommonResponse } from "../models/Common";
import { BrandApi, GetBrandListParams } from "../apis/BrandAPI";

export const useGetBrandList = (params: GetBrandListParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
  }: UseQueryResult<CommonResponse<BrandDetail>, Error> = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      return await BrandApi._getBrandList(params);
    },
  });

  return { isError, isLoading, data, error };
};

import { UseQueryResult, useQuery } from "react-query";
import { GetImageParams, ImageAPI } from "../apis/ImageAPI";

export const useGetImageById = (params: GetImageParams) => {
  const { isLoading, data, isError, error }: UseQueryResult<any, Error> =
    useQuery({
      queryKey: ["image", params.id],
      queryFn: async () => {
        return await ImageAPI._getImageById(params);
      },
    });

  return { isError, isLoading, data, error };
};

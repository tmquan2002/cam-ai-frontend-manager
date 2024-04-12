import { UseQueryResult, useQuery } from "react-query";
import { ImageAPI } from "../apis/Image";

export const useGetImageById = (imageId: string) => {
  const { isLoading, data, isError, error }: UseQueryResult<any, Error> =
    useQuery({
      queryKey: ["image", imageId],
      enabled: !!imageId,
      queryFn: async () => {
        return await ImageAPI._getImageById(imageId);
      },
    });

  return { isError, isLoading, data, error };
};

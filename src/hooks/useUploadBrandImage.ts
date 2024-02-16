import { useMutation } from "react-query";
import { BrandApi, UploadBrandImageParams } from "../apis/BrandAPI";

export const useUploadBrandImage = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["upload", "image", "brand"],
    mutationFn: async (parmas: UploadBrandImageParams) => {
      return await BrandApi._uploadBrandImage(parmas);
    },
  });

  return { mutate, isLoading, error, data };
};

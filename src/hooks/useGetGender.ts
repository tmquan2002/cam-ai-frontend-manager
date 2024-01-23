import { UseQueryResult, useQuery } from "react-query";
import { LookupAPI } from "../apis/LookupAPI";
import { DicWithStringKey } from "../models/Lookup";

export const useGetGenderList = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: UseQueryResult<DicWithStringKey, Error> = useQuery({
    queryKey: ["gender"],
    queryFn: async () => {
      return await LookupAPI._getGender();
    },
  });

  return { isError, isLoading, data, error };
};

import { UseQueryResult, useQuery } from "react-query";
import { AccountDetail } from "../models/Account";
import { ProfileAPI } from "../apis/ProfileAPI";

export const useGetProfile = () => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: UseQueryResult<AccountDetail, Error> = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await ProfileAPI._getProfile();
    },
  });

  return { isError, isLoading, data, error, refetch };
};

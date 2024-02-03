import { UseQueryResult, useQuery } from "react-query";
import { EmployeeDetail } from "../models/Employee";
import { EmployeeApi } from "../apis/EmployeeAPI";

export const useGetEmployeeById = (id: string) => {
  const {
    isError,
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  }: UseQueryResult<EmployeeDetail, Error> = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      return await EmployeeApi._getEmployeeById(id);
    },
  });

  return { isError, isLoading, data, error, refetch, isFetching };
};

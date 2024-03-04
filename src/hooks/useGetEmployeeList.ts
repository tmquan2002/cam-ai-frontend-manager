import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { EmployeeApi, GetEmployeeListParams } from "../apis/EmployeeAPI";
import { EmployeeDetail } from "../models/Employee";

export const useGetEmployeeList = (params: GetEmployeeListParams) => {
  const {
    isError,
    isLoading,
    data,
    error,
  }: UseQueryResult<CommonResponse<EmployeeDetail>, Error> = useQuery({
    queryKey: ["employees", params],
    queryFn: async () => {
      return await EmployeeApi._getEmployeeList(params);
    },
  });

  return { isError, isLoading, data, error };
};

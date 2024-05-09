import { UseQueryResult, useQuery } from "react-query";
import { CommonResponse } from "../models/Common";
import { EmployeeApi, GetEmployeeListParams } from "../apis/EmployeeAPI";
import { EmployeeDetail } from "../models/Employee";

export const useGetEmployeeList = ({
  enabled,
  ...rest
}: GetEmployeeListParams & { enabled?: boolean }) => {
  const {
    isError,
    isLoading,
    data,
    error,
  }: UseQueryResult<CommonResponse<EmployeeDetail>, Error> = useQuery({
    queryKey: ["employees", rest],
    enabled: enabled ?? true,
    queryFn: async () => {
      return await EmployeeApi._getEmployeeList(rest);
    },
  });

  return { isError, isLoading, data, error };
};

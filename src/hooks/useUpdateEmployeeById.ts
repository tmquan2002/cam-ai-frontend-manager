import { useMutation } from "react-query";
import { EmployeeApi, UpdateEmployeeParams } from "../apis/EmployeeAPI";

export const useUpdateEmployeeById = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["update", "employee"],
    mutationFn: async (
      params: UpdateEmployeeParams & { employeeId: string }
    ) => {
      return await EmployeeApi._updateEmployeeById(params);
    },
  });

  return { mutate, isLoading, error, data };
};

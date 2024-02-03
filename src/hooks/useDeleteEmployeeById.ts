import { useMutation } from "react-query";
import { EmployeeApi } from "../apis/EmployeeAPI";

export const useDeleteEmployeeById = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["delete", "employee"],
    mutationFn: async (employeeId: string) => {
      return await EmployeeApi._deleteEmployeeById(employeeId);
    },
  });

  return { mutate, isLoading, error, data };
};

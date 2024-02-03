import { UseMutationResult, useMutation } from "react-query";
import { EmployeeDetail } from "../models/Employee";
import { CreateEmployeeParams, EmployeeApi } from "../apis/EmployeeAPI";

export const useCreateEmployee = () => {
  const {
    mutate,
    isLoading,
    error,
    data,
  }: UseMutationResult<EmployeeDetail, Error, CreateEmployeeParams> =
    useMutation({
      mutationKey: ["create", "employee"],
      mutationFn: async (params: CreateEmployeeParams) => {
        return await EmployeeApi._createEmployee(params);
      },
    });

  return { mutate, isLoading, error, data };
};

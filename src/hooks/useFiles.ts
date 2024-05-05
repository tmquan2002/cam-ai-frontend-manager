import { UseQueryResult, useMutation, useQuery } from "react-query";
import { EmployeeApi } from "../apis/EmployeeAPI";
import { FilesAPI } from "../apis/FilesAPI";
import { ShopAPI } from "../apis/ShopAPI";

export const useGetShopTemplate = () => {
    const { isError, isLoading, data, error, }: UseQueryResult<File, Error> = useQuery({
        queryKey: ["shopTemp"],
        queryFn: async () => {
            return await FilesAPI._getShopTemplate();
        },
    });

    return { isError, isLoading, data, error };
};

export const useGetEmployeeTemplate = () => {
    const { isError, isLoading, data, error, }: UseQueryResult<File, Error> = useQuery({
        queryKey: ["employeeTemp"],
        queryFn: async () => {
            return await FilesAPI._getEmployeeTemplate();
        },
    });

    return { isError, isLoading, data, error };
};

export const useUploadShopFile = () => {
    const { mutate, isLoading, error, data } = useMutation({
        mutationKey: "uploadShopFile",
        mutationFn: async (params: { file: File }) => {
            return await ShopAPI._uploadShopFile(params);
        },
    });

    return { mutate, isLoading, error, data };
};

export const useGetShopUpsertTask = () => {
    const { isError, isLoading, data, error, }: UseQueryResult<string[], Error> = useQuery({
        queryKey: ["getShopUpsertTask"],
        queryFn: async () => {
            return await ShopAPI._getShopUpsertTask();
        },
    });

    return { isError, isLoading, data, error };
};

export const useGetShopUpsertTaskResult = (taskId: string) => {
    const { isError, isLoading, data, error, }: UseQueryResult<{
        inserted: number;
        updated: number;
        failed: number;
        metadata: string[];
    }, Error> = useQuery({
        queryKey: ["getShopUpsertTaskResult"],
        queryFn: async () => {
            return await ShopAPI._getShopUpsertTaskResult(taskId);
        },
    });

    return { isError, isLoading, data, error };
};

export const useUploadEmployeeFile = () => {
    const { mutate, isLoading, error, data } = useMutation({
        mutationKey: "uploadEmployeeFile",
        mutationFn: async (params: { file: File }) => {
            return await EmployeeApi._uploadEmployeeFile(params);
        },
    });

    return { mutate, isLoading, error, data };
};

export const useGetEmployeeUpsertTask = () => {
    const { isError, isLoading, data, error, }: UseQueryResult<string[], Error> = useQuery({
        queryKey: ["getEmployeeUpsertTask"],
        queryFn: async () => {
            return await EmployeeApi._getEmployeeUpsertTask();
        },
    });

    return { isError, isLoading, data, error };
};

export const useGetEmployeeUpsertTaskResult = (taskId: string) => {
    const { isError, isLoading, data, error, }: UseQueryResult<{
        inserted: number;
        updated: number;
        failed: number;
        metadata: string[];
    }, Error> = useQuery({
        queryKey: ["getEmployeeUpsertTaskResult"],
        queryFn: async () => {
            return await EmployeeApi._getEmployeeUpsertTaskResult(taskId);
        },
    });

    return { isError, isLoading, data, error };
};

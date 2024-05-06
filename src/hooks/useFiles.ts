import { UseQueryResult, useMutation, useQuery } from "react-query";
import { EmployeeApi } from "../apis/EmployeeAPI";
import { FilesAPI } from "../apis/FilesAPI";
import { ShopAPI } from "../apis/ShopAPI";

export const useGetShopTemplate = () => {
    const downloadFile = async () => {
        const response = await FilesAPI._getShopTemplate();

        const filename = response.headers['content-disposition']
            ?.split(';')
            .find((part: string) => part.trim().startsWith('filename='))
            ?.split('=')[1]
            .trim() || 'ShopTemplate.csv';

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const blobUrl = URL.createObjectURL(blob);

        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', filename);
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(blobUrl);
    };

    return useQuery<void>('shopTempDownload', downloadFile, {
        enabled: false, // Initially disabled until explicitly called
        retry: false, // Disable automatic retries
    });
};

export const useGetEmployeeTemplate = () => {
    const downloadFile = async () => {
        const response = await FilesAPI._getEmployeeTemplate();

        const filename = response.headers['content-disposition']
            ?.split(';')
            .find((part: string) => part.trim().startsWith('filename='))
            ?.split('=')[1]
            .trim() || 'EmployeeTemplate.csv';

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const blobUrl = URL.createObjectURL(blob);

        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', filename);
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(blobUrl);
    };

    return useQuery<void>('employeeTempDownload', downloadFile, {
        enabled: false, // Initially disabled until explicitly called
        retry: false, // Disable automatic retries
    });
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

import { getAccessToken } from "../context/AuthContext";
import { Gender } from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import { EmployeeDetail } from "../models/Employee";
import http, { toQueryParams } from "../utils/http";

export type GetEmployeeListParams = {
  search?: string;
  employeeStatus?: string | null;
  brandId?: string;
  shopId?: string | null;
  size?: number | null;
  pageIndex?: number;
  email?: string
  phone?: string
};

export type CreateEmployeeParams = {
  name: string;
  email: string | null;
  gender: Gender;
  phone?: string | null;
  birthday?: string | null;
  addressLine?: string | null;
  wardId?: number | null;
};

export type UpdateEmployeeParams = {
  name: string;
  email: string;
  gender: Gender;
  phone?: string | null;
  birthday?: string | null;
  addressLine?: string | null;
  wardId?: number | null;
};

export const EmployeeApi = {
  _getEmployeeList: async (params: GetEmployeeListParams) => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<EmployeeDetail>>(
      `/api/employees?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _createEmployee: async (params: CreateEmployeeParams) => {
    const access_token = getAccessToken();

    const res = await http.post<EmployeeDetail>(`/api/employees`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _getEmployeeById: async (employeeId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<EmployeeDetail>(`/api/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _updateEmployeeById: async (
    params: UpdateEmployeeParams & { employeeId: string }
  ) => {
    const access_token = getAccessToken();

    const res = await http.put<EmployeeDetail>(
      `/api/employees/${params.employeeId}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _deleteEmployeeById: async (employeeId: string) => {
    const access_token = getAccessToken();

    const res = await http.delete(`/api/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _uploadEmployeeFile: async (params: { file: File }) => {
    const access_token = getAccessToken();
    const form = new FormData();
    form.append("file", params.file);

    const res = await http.post<{ taskId: string, message: string }>(`/api/employees/upsert`, form, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data;
  },

  _getEmployeeUpsertTask: async () => {
    const access_token = getAccessToken();

    const res = await http.get<string[]>(`/api/employees/upsert/task`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },

  _getEmployeeUpsertTaskResult: async (taskId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<{
      inserted: number;
      updated: number;
      failed: number;
      metadata: string[];
    }>(`/api/employees/upsert/task/${taskId}/result`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
};

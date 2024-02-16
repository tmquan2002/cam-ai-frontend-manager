import { getAccessToken } from "../context/AuthContext";
import { CommonResponse } from "../models/Common";
import { EmployeeDetail } from "../models/Employee";
import http, { toQueryParams } from "../utils/http";

export type GetEmployeeListParams = {
  search?: string;
  employeeStatusId?: number;
  brandId?: string;
  shopId?: string;
  size?: number;
  pageIndex?: number;
};

export type CreateEmployeeParams = {
  name: string;
  email: string;
  gender: number;
  phone?: string | null;
  birthday?: string | null;
  addressLine?: string | null;
  wardId?: number | null;
};

export type UpdateEmployeeParams = {
  name: string;
  email: string;
  gender: string;
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

    const res = await http.delete<any>(`/api/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
};
import { getAccessToken } from "../context/AuthContext";
import { Role } from "../models/CamAIEnum";
import { SuperVisorAssignmentDetail } from "../models/Shop";
import http, { toQueryParams } from "../utils/http";

export type AssignSuperVisorParams = {
  employeeId: string;
  role: Role.ShopHeadSupervisor | Role.ShopSupervisor;
};

export type GetAssignHistoryParams = {
  date: string;
};

export type GetSupervisorAssignHistoryParams = {
  date: string;
};

export const CalendarAPI = {
  _assignSuperVisor: async (params: AssignSuperVisorParams) => {
    const access_token = getAccessToken();

    const res = await http.post(`/api/shops/employee/supervisor`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _getAssignHistory: async (params: GetAssignHistoryParams) => {
    const access_token = getAccessToken();

    const res = await http.get<SuperVisorAssignmentDetail[]>(
      `/api/supervisorassignments?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _getSupervisorAssignHistory: async (
    params: GetSupervisorAssignHistoryParams
  ) => {
    const access_token = getAccessToken();

    const res = await http.get<SuperVisorAssignmentDetail[]>(
      `/api/supervisorassignments?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _deleteHeadSupervisor: async () => {
    const access_token = getAccessToken();

    const res = await http.delete(`/api/shops/headsupervisor`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _deleteSupervisor: async () => {
    const access_token = getAccessToken();

    const res = await http.delete(`/api/shops/supervisor`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
};

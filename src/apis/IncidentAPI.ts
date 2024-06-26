import { getAccessToken } from "../context/AuthContext";
import {
  IncidentStatus,
  IncidentType,
  ReportInterval,
} from "../models/CamAIEnum";
import { CommonResponse } from "../models/Common";
import { IncidentDetail, IncidentPercentDetail } from "../models/Incident";
import { IncidentReportByTimeDetail } from "../models/Report";
import http, { toQueryParams } from "../utils/http";

export type GetIncidentParams = {
  incidentType?: IncidentType | null;
  fromTime?: string | null;
  toTime?: string | null;
  edgeBoxId?: string | null;
  status?: IncidentStatus | null;
  shopId?: string | null;
  brandId?: string | null;
  employeeId?: string | null;
  size?: number | null;
  pageIndex?: number | null;
};

export type AssignIncidentParams = {
  incidentId: string;
  employeeId: string;
};

export type GetIncidentReportByTimeParams = {
  shopId?: string;
  startDate?: string;
  endDate?: string;
  interval: ReportInterval;
  type: IncidentType;
};

export type GetIncidentPercentParams = {
  shopId?: string;
  startDate: string;
  endDate: string;
  type: IncidentType;
};
export type MassRejectIncidentParams = {
  incidentIds: string[];
};

export type MassAssignIncidentParams = {
  incidentIds: string[];
  employeeId: string;
};

export const IncidentApi = {
  _getIncidentById: async (incidentId: string) => {
    const access_token = getAccessToken();

    const res = await http.get<IncidentDetail>(`/api/incidents/${incidentId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _getIncidentList: async (params: GetIncidentParams) => {
    const access_token = getAccessToken();

    const res = await http.get<CommonResponse<IncidentDetail>>(
      `/api/incidents?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _rejectIncident: async (incidentId: string) => {
    const access_token = getAccessToken();

    const res = await http.put(
      `/api/incidents/${incidentId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _massRejectIncident: async (params: MassRejectIncidentParams) => {
    const access_token = getAccessToken();

    const res = await http.post(`/api/incidents/reject`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _assignIncident: async ({ employeeId, incidentId }: AssignIncidentParams) => {
    const access_token = getAccessToken();

    const res = await http.put(
      `/api/incidents/${incidentId}/employee/${employeeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _massAssignIncident: async (params: MassAssignIncidentParams) => {
    const access_token = getAccessToken();

    const res = await http.post(`/api/incidents/accept`, params, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res?.data;
  },
  _getIncidentReportByTime: async (params: GetIncidentReportByTimeParams) => {
    const access_token = getAccessToken();

    const res = await http.get<IncidentReportByTimeDetail>(
      `/api/incidents/count?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _getIncidentPercent: async (params: GetIncidentPercentParams) => {
    const access_token = getAccessToken();

    const res = await http.get<IncidentPercentDetail>(
      `/api/incidents/percent?${toQueryParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
  _getIncidentByAssignmentId: async (id: string) => {
    const access_token = getAccessToken();

    const res = await http.get<IncidentDetail[]>(
      `/api/supervisorassignments/${id}/incidents`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res?.data;
  },
};

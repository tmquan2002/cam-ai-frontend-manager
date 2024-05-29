import { AccountDetail } from "./Account";
import {
  EventType,
  IncidentStatus,
  IncidentType
} from "./CamAIEnum";
import { EdgeboxDetail } from "./Edgebox";
import { EmployeeDetail } from "./Employee";
import { EvidenceDetail } from "./Evidence";
import { ShopDetail, SuperVisorAssignmentDetail } from "./Shop";

export type IncidentDetail = {
  aiId: number;
  incidentType: IncidentType;
  startTime: string;
  endTime: string;
  edgeBoxId: string;
  employeeId: string;
  status: IncidentStatus;
  shopId: string;
  shop: ShopDetail | null;
  edgeBox: EdgeboxDetail | null;
  employee: EmployeeDetail | null;
  evidences: EvidenceDetail[];
  id: string;
  createdDate: string;
  assigningAccount: AccountDetail | null;
  assigningAccountId: string | null;
  inChargeAccount: AccountDetail | null;
  inChargeAccountId: string | null;
  assignmentId: string | null;
  assignment: SuperVisorAssignmentDetail | null;
};

export type WebSocketIncident = {
  EventType: EventType;
  Incident: IncidentDetail;
};

export type IncidentPercentDetail = {
  shopId: string;
  startDate: string;
  endDate: string;
  total: number;
  statuses: IncidentPercentStatusDetail[];
  types: IncidentPercentTypeDetail[];
};

export type IncidentPercentStatusDetail = {
  status: IncidentStatus;
  total: number;
  percent: number;
};
export type IncidentPercentTypeDetail = {
  type: IncidentType;
  total: number;
  percent: number;
  statuses: IncidentPercentStatusDetail[];
};

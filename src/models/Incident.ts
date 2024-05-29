import { AccountDetail } from "./Account";
import {
  EdgeBoxStatus,
  EventType,
  IncidentStatus,
  IncidentType,
  Role,
} from "./CamAIEnum";
import { EmployeeDetail } from "./Employee";
import { EvidenceDetail } from "./Evidence";
import { ShopDetail } from "./Shop";

export type IncidentDetail = {
  aiId: number;
  incidentType: IncidentType;
  startTime: string;
  endTime: string;
  edgeBoxId: string;
  employeeId: string;
  shopId: string;
  status: IncidentStatus;
  assigningAccountId: string | null;
  assigningAccount: AccountDetail | null;
  assignmentId: string | null;
  assignment: AssignmentDetail | null;
  evidences: EvidenceDetail[];
  id: string;
  shop: ShopDetail | null;
  edgeBox: EdgeBoxStatus | null;
  employee: EmployeeDetail | null;
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

export type AssignmentDetail = {
  id: string;
  shopId: string;
  supervisorId: string | null;
  inChargeAccountId: string | null;
  inChargeAccountRole: Role;
  inChargeEmployeeId: string | null;
  startTime: string;
  endTime: string;
  supervisor: AccountDetail | null;
  inChargeAccount: AccountDetail | null;
  incidents: IncidentDetail[];
  interactions: IncidentDetail[];
};

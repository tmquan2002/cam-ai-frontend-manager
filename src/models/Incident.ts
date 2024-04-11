import { EdgeBoxStatus, IncidentStatus, IncidentType } from "./CamAIEnum";
import { EmployeeDetail } from "./Employee";
import { EvidenceDetail } from "./Evidence";
import { ShopDetail } from "./Shop";

export type IncidentDetail = {
  incidentType: IncidentType;
  startTime: string;
  endTime: string;
  edgeBoxId: string;
  employeeId: string;
  status: IncidentStatus;
  shopId: string;
  shop: ShopDetail;
  edgeBox: EdgeBoxStatus | null;
  employee: EmployeeDetail | null;
  evidences: EvidenceDetail[];
  id: string;
  createdDate: string;
};

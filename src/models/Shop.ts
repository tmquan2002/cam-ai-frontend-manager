import { AccountDetail } from "./Account";
import { WardDetail } from "./Address";
import { BrandDetail } from "./Brand";
import { Role, ShopStatus } from "./CamAIEnum";
import { IncidentDetail } from "./Incident";

export type ShopDetail = {
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  timestamp: string;
  name: string;
  phone: string;
  wardId: number;
  addressLine: string;
  ward: WardDetail;
  brand: BrandDetail;
  shopStatus: ShopStatus;
  shopManager: AccountDetail;
  openTime: string;
  closeTime: string;
};

export type SuperVisorAssignmentDetail = {
  id: string;
  shopId: string;
  headSupervisorId: string;
  supervisorId: string;
  startTime: string;
  endTime: string;
  headSupervisor: AccountDetail;
  incidents: IncidentDetail[];
  inChargeAccount: AccountDetail;
  inChargeAccountId: string;
  inChargeAccountRole: Role;
  interactions: IncidentDetail[];
  supervisor: AccountDetail;
};

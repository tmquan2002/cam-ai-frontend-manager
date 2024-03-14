import { IncidnetStatus } from "./CamAIEnum";
import { EdgeBox } from "./EdgeBox";
import { EmployeeDetail } from "./Employee";
import { Evidence } from "./Evidences";
import { ShopDetail } from "./Shop";

export interface Incident {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    incidentType: string | number;
    time: string;
    edgeBoxId: string;
    status: IncidnetStatus;
    shopId: string;
    employeeId: string;
    edgeBox: EdgeBox;
    shop: ShopDetail;
    employee: EmployeeDetail;
    evidences: Evidence[];
}
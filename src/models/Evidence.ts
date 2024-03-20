import { EvidenceStatus, EvidenceType } from "./CamAIEnum";
import { IncidentDetail } from "./Incident";

export type EvidenceDetail = {
  evidenceType: EvidenceType;
  incidentId: string;
  cameraId: string;
  imageId: string;
  status: EvidenceStatus;
  image: {
    hostingUri: string;
    contentType: string;
    id: string;
    createdDate: string;
  };
  incident: IncidentDetail | null;
  id: string;
  createdDate: string;
};

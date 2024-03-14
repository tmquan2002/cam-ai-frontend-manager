import { EvidenceStatus, EvidenceType } from "./CamAIEnum";
import { Camera } from "./Camera";
import { Image } from "./Image";
import { Incident } from "./Incident";

export interface Evidence {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    incidentId: string;
    cameraId: string;
    imageId: string;
    evidenceType: EvidenceType;
    status: EvidenceStatus;
    image: Image;
    incident: Incident;
    camera: Camera;
};
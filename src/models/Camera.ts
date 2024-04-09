import { CameraStatus, Zone } from "./CamAIEnum";

export type CameraDetail = {
    name: string,
    shopId: string,
    zone: Zone,
    status: CameraStatus,
    id: string,
}
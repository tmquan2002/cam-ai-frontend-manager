import { EdgeBoxLocation, EdgeBoxStatus, EdgeboxInstallStatus } from "./CamAIEnum";
import { ShopDetail } from "./Shop";

export interface EdgeBox {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    username: string;
    password: string;
    name: string;
    version: string;
    edgeBoxModelId: string;
    edgeBoxStatus: EdgeBoxStatus;
    edgeBoxLocation: EdgeBoxLocation;
    edgeBoxModel: EdgeBoxModel;
    installs: EdgeBoxInstall[];
}

export interface EdgeBoxInstall {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    edgeBoxId: string;
    shopId: string;
    ipAddress: string;
    port: number;
    validFrom: string;
    validUntil: string;
    edgeBox: EdgeBox;
    shop: ShopDetail;
    edgeBoxInstallStatus: EdgeboxInstallStatus;
}

export interface EdgeBoxModel {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    description: string;
    modelCode: string;
    manufacturer: string;
    cpu: string;
    ram: string;
    storage: string;
    os: string;
    edgeBoxes: EdgeBox[];
}
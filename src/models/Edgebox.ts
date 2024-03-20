import {
  EdgeBoxLocation,
  EdgeBoxStatus,
  EdgeboxInstallStatus,
} from "./CamAIEnum";
import { ShopDetail } from "./Shop";

export type EdgeboxDetail = {
  name: string;
  version: string;
  edgeBoxStatus: EdgeBoxStatus;
  edgeBoxLocation: EdgeBoxLocation;
  edgeBoxModelId: string;
  edgeBoxModel: EdgeBoxModelDetail | null;
  id: string;
  createdDate: string;
};

export type EdgeBoxModelDetail = {
  name: string;
  description: string;
  modelCode: string;
  manufacturer: string;
  cpu: string;
  ram: string;
  storage: string;
  os: string;
  id: string;
  createdDate: string;
  modifiedDate: string;
};

export type EdgeBoxInstallDetail = {
  edgeBoxId: string;
  shopId: string;
  ipAddress: string;
  port: number;
  validFrom: string;
  validUntil: string;
  edgeBoxInstallStatus: EdgeboxInstallStatus;
  edgeBox: EdgeboxDetail;
  shop: ShopDetail;
  id: string;
  createdDate: string;
  modifiedDate: string;
};

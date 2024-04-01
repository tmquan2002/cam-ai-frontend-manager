import { BrandDetail } from "./Brand";
import {
  EdgeBoxActivationStatus,
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
};

export type EdgeBoxInstallDetail = {
  edgeBoxId: string;
  shopId: string;
  uninstalledTime: string | null;
  activationStatus: EdgeBoxActivationStatus;
  edgeBoxInstallStatus: EdgeboxInstallStatus;
  edgeBox: EdgeboxDetail;
  shop: ShopDetail;
  brand: BrandDetail;
  id: string;
};

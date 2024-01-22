import { BrandDetail } from "./Brand";

export type ShopDetail = {
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  timestamp: string;
  name: string;
  phone: string;
  wardId: string;
  addressLine: string;
  ward: {
    id: string;
    createdDate: Date;
    modifiedDate: Date;
    timestamp: string;
  };
  brand: BrandDetail;
  shopStatus: {
    timestamp: string;
    id: 0;
    name: string;
    description: string;
  };
};

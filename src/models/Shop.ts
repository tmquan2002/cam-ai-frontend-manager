import { WardDetail } from "./Address";
import { BrandDetail } from "./Brand";

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
  shopStatus: {
    timestamp: string;
    id: 0;
    name: string;
    description: string;
  };
};

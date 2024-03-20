import { AccountDetail } from "./Account";
import { WardDetail } from "./Address";
import { BrandDetail } from "./Brand";
import { ShopStatus } from "./CamAIEnum";

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
};

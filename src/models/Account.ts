import { WardDetail } from "./Address";
import { AccountStatus, Role, ShopStatus } from "./CamAIEnum";

export type AccountDetail = {
  email: string;
  name: string;
  gender: string;
  phone: string;
  birthday: string;
  wardId: string;
  addressLine: string;
  workingShopId: string;
  accountStatusId: number;
  ward: WardDetail;
  workingShop: any;
  accountStatus: AccountStatus;
  brand: any;
  managingShop: {
    name: string;
    phone: string;
    wardId: string;
    addressLine: string;
    ward: WardDetail;
    brand: any;
    shopStatus: ShopStatus;
    id: string;
    createdDate: Date;
    modifiedDate: Date;
    timestamp: string;
  };
  role: Role;
  id: string;
  createdDate: string;
  modifiedDate: string;
  timestamp: string;
};

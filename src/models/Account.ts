import { WardDetail } from "./Address";
import { BrandDetail } from "./Brand";
import { AccountStatus, Role, ShopStatus } from "./CamAIEnum";

export type AccountDetail = {
  email: string;
  name: string;
  gender: string;
  phone: string;
  birthday: string;
  wardId: string;
  addressLine: string;
  ward: WardDetail;
  accountStatus: AccountStatus;
  brand: BrandDetail;
  managingShop: {
    name: string;
    phone: string;
    wardId: string;
    addressLine: string;
    ward: WardDetail;
    shopStatus: ShopStatus;
    id: string;
    createdDate: Date;
    modifiedDate: Date;
  };
  role: Role;
  id: string;
  createdDate: string;
  modifiedDate: string;
};

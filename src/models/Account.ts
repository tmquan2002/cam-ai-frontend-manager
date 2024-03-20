import { WardDetail } from "./Address";
import { BrandDetail } from "./Brand";
import { AccountStatus, Gender, Role } from "./CamAIEnum";
import { ShopDetail } from "./Shop";

export type AccountDetail = {
  email: string;
  name: string;
  gender: Gender;
  phone: string;
  birthday: string;
  wardId: number;
  addressLine: string;
  ward: WardDetail;
  accountStatus: AccountStatus;
  brand: BrandDetail;
  managingShop: ShopDetail;
  role: Role;
  id: string;
  createdDate: string;
  modifiedDate: string;
};

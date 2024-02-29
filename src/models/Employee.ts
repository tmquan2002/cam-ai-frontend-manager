import { WardDetail } from "./Address";
import { EmployeeStatus } from "./CamAIEnum";
import { ShopDetail } from "./Shop";

export type EmployeeDetail = {
  name: string;
  email: string;
  gender: string;
  phone: string;
  image: string;
  birthday: string;
  addressLine: string;
  wardId: number;
  shopId: string;
  ward: WardDetail;
  shop: ShopDetail;
  employeeStatus: EmployeeStatus;
  id: string;
  createdDate: Date;
  modifiedDate: Date;
};

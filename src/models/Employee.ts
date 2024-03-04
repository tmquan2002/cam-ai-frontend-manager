import { WardDetail } from "./Address";
import { EmployeeStatus, Gender } from "./CamAIEnum";
import { ShopDetail } from "./Shop";

export type EmployeeDetail = {
  name: string;
  email: string;
  gender: Gender;
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

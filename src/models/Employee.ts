import { WardDetail } from "./Address";
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
  employeeStatusId: number;
  ward: WardDetail;
  shop: ShopDetail;
  employeeStatus: {
    id: number;
    name: string;
    description: string;
  };
  id: string;
  createdDate: Date;
  modifiedDate: Date;
};

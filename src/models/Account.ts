import { WardDetail } from "./Address";

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
  accountStatus: {
    id: number;
    name: string;
    description: string;
  };
  brand: any;
  managingShop: {
    name: string;
    phone: string;
    wardId: string;
    addressLine: string;
    ward: WardDetail;
    brand: any;
    shopStatus: string;
    id: string;
    createdDate: Date;
    modifiedDate: Date;
    timestamp: string;
  };
  roles: RoleDetail[];
  id: string;
  createdDate: string;
  modifiedDate: string;
  timestamp: string;
};

export type RoleDetail = {
  id: number;
  name: string;
  description: string;
};

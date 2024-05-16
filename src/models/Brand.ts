import { AccountDetail } from "./Account";
import { WardDetail } from "./Address";
import { BrandStatus } from "./CamAIEnum";
import { Image } from "./Image";
import { ShopDetail } from "./Shop";

export type BrandDetail = {
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  companyName: string;
  brandWebsite: string;
  companyAddress: string;
  companyWardId: string;
  logoId: string;
  logo: Image;
  bannerId: string;
  banner: Image;
  brandManagerId: string;
  brandManager: AccountDetail;
  brandStatus: BrandStatus;
  accounts: AccountDetail[];
  shops: ShopDetail[];
  companyWard: WardDetail;
}

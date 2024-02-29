import { BrandStatus } from "./CamAIEnum";
import { Image } from "./Image";

export type BrandDetail = {
  name: string;
  email: string;
  phone: string;
  logo: Image;
  banner: Image;
  brandManagerId: string;
  brandStatus: BrandStatus;
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  timestamp: string;
};

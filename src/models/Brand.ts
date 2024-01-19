export type BrandDetail = {
  name: string;
  email: string;
  phone: string;
  logoUri: string;
  bannerUri: string;
  brandManagerId: string;
  brandStatus: {
    name: string;
    description: string;
  };
  id: string;
  createdDate: Date;
  modifiedDate: Date;
  timestamp: string;
};

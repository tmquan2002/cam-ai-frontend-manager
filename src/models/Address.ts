export type WardDetail = {
  id: number;
  name: string;
  districtId: number;
  district: DistrictDetail;
};

export type ProvinceDetail = {
  id: number;
  name: string;
};

export type DistrictDetail = {
  id: number;
  name: string;
  provinceId: number;
  province: ProvinceDetail;
};

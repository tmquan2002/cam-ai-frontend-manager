import http from "../utils/http";

export const LookupAPI = {
  _getGender: async () => {
    const res = await http.get("/api/lookup/gender");
    return res.data;
  },
  _getAccountStatus: async () => {
    const res = await http.get("/api/lookup/account-status");
    return res.data;
  },
  _getProvinceList: async () => {
    const res = await http.get("/api/locations/provinces");
    return res.data;
  },
  _getDistrictList: async (provinceId: number) => {
    const res = await http.get(
      `/api/locations/provinces/${provinceId}/districts`
    );
    return res.data;
  },
  _getWardList: async (districtId: number) => {
    const res = await http.get(`/api/locations/districts/${districtId}/wards`);
    return res.data;
  },
};

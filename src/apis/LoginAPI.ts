import axios from "axios";
import http from "../utils/http";
import { AuthToken } from "../models/Auth";

export type LoginParams = {
  username: string;
  password: string;
};

export const LoginAPI = {
  login: async (params: LoginParams) => {
    const res = await http.post("/api/auth", params);
    return res?.data;
  },
  refresh: async (params: AuthToken) => {
    try{
      const res = await axios.post<string>(`${process.env.REACT_APP_VITE_SERVER_LINK}api/auth/refresh`, params);
      return res?.data;
    }catch(err){
      return null;
    }
  },
};

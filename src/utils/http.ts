import axios, { AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshAuth } from "../hooks/refresh-auth";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_VITE_SERVER_LINK,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    createAuthRefreshInterceptor(this.instance, refreshAuth, {
      statusCodes: [401], // default: [ 401 ]
      shouldRefresh:(err) => err?.response?.headers?.auto == "True",
      pauseInstanceWhileRefreshing: true,
    });
  }
}

export const toQueryParams = (data: any): string => {
  const qs = Object.keys(data)
    .map((key) =>
      Array.isArray(data[key])
        ? data[key].map((v: string) => `${key}=${v}`).join("&")
        : `${key}=${data[key]}`
    )
    .join("&");

  return qs;
};

const http = new Http().instance;

export const setHeaderToken = (token: string) => {
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default http;

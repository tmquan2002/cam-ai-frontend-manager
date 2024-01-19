import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.VITE_SERVER_LINK,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
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

export default http;
